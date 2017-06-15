import {
  Scene,
  Vector2,
  // Vector3,
  Vector4,
  TextureLoader,
  Raycaster,
  Clock,
  WebGLRenderer,
  PerspectiveCamera,
  // SphereBufferGeometry,
  PlaneBufferGeometry,
  PlaneGeometry,
  // FrontSide,
  Mesh,
  // LinearFilter,
  // Object3D,
  // FlatShading,
  ShaderMaterial,
  // MeshBasicMaterial,
  // CubeTextureLoader,
  DoubleSide,
  Geometry,
  RepeatWrapping,
  CubeCamera,
  LinearToneMapping,
  LinearMipMapLinearFilter,
  Color
  // Texture
  // SubtractiveBlending
  // BackSide,
} from 'three/src/Three';

// these are not written as modules, we import them directly
require('three/examples/js/postprocessing/EffectComposer');
require('three/examples/js/shaders/CopyShader');
require('three/examples/js/shaders/LuminosityHighPassShader');
require('three/examples/js/shaders/ConvolutionShader');
require('three/examples/js/shaders/FXAAShader');
require('three/examples/js/postprocessing/RenderPass');
require('three/examples/js/postprocessing/ShaderPass');
require('three/examples/js/postprocessing/MaskPass');
require('three/examples/js/postprocessing/SSAARenderPass');
require('three/examples/js/postprocessing/UnrealBloomPass');

import Detector from 'three/examples/js/Detector';
import Stats from 'three/examples/js/libs/stats.min';
import dat from 'three/examples/js/libs/dat.gui.min';
import xhrRequest from 'xhr-request';

const analyser = require('web-audio-analyser');

// import ElasticNumber from 'elasticNumber';
import ElasticVector2 from 'elasticVector2';

import { TweenMax, Power4 } from 'gsap';
require('gsap/ColorPropsPlugin');

import tunnelVert from 'tunnel.vert';
import tunnelFrag from 'tunnel.frag';

import blobVert from 'blob.vert';
// import blobFrag from 'blob.frag';
import blobFrag from 'blobReflective.frag';

export default class MONOGRIDAudioReactive {

  constructor() {
    this._name = 'MONOGRIDAudioReactive';
  }

  destroy() {
    this._destroyed = true;
    this._element.removeEventListener('mousemove', this._onMouseMove.bind(this));
    this._element.removeEventListener('mousedown', this._onMouseDown.bind(this));
    this._element.removeEventListener('mouseup', this._onMouseUp.bind(this));

    this._element.removeEventListener('touchmove', this._onMouseMove.bind(this));
    this._element.removeEventListener('touchstart', this._onMouseDown.bind(this));
    this._element.removeEventListener('touchend', this._onMouseUp.bind(this));
  }

  init(params) {

    if (!Detector.webgl) {
      return false;
    }

    this._playButton = params.playButton;
    this._pauseButton = params.pauseButton;
    this._restartButton = params.restartButton;
    this._startExperienceButton = params.startExperienceButton;

    this._playButton.style.display =
    this._pauseButton.style.display =
    this._restartButton.style.display = 'none';
    this._isPlaying = false;

    this._playButton.addEventListener('click', this._onPlayClick.bind(this));
    this._pauseButton.addEventListener('click', this._onPauseClick.bind(this));
    this._restartButton.addEventListener('click', this._onRestartClick.bind(this));
    window.addEventListener('keyup', this._onKeyPress.bind(this));

    this._element = params.element;
    this._destroyed = false;

    this._currentScene = 0;
    this._params = {
      wireframe: false,
      bgColor: 'rgb(0,0,0)',
      exposure: 0,
      cameraBaseRotation: 0,
      cameraReactiveRotation: 0,
      blobReactiveness: 0,
      tunnelBaseSpeed: 0,
      tunnelReactiveSpeed: 0,
      tunnelTextureRotateBase: 0,
      tunnelTextureRotateReactive: 0,
      tunnelTextureMix: 0,
      bloomStrength: 0,
      bloomReactiveness: 0,
      bloomThreshold: 0,
      bloomRadius: 0,
      blobColor: 0,
      blobHighlight: 0,
      blobReflectiveness: 0,
      texture1: '',
      texture1b: '',
      texture2: '',
      texture2b: '',
      interactive: false,
      bassCutOff: 0.3,
      vocalsCutOff: 0.3
    };

    this._scene = new Scene();
    this._mousePosition = new Vector2(-100, -100);
    this._mousePickingPosition = new Vector2(0, 0);
    this._elasticMousePickingPosition = new ElasticVector2(new Vector2());
    this._mouseDownPosition = new Vector2(0, 0);
    this._textureLoader = new TextureLoader();
    this._raycaster = new Raycaster();
    this._clock = new Clock(true);
    this._viewportWidth = null;
    this._viewportHeight = null;
    this._tunnelLenght = 200;
    this._reactiveBloom = 1;
    this._bgColor = new Color();

    this._tunnelDistortion = new Vector2(0, 0);

    this._renderer = new WebGLRenderer({
      antialias: false,
      canvas: this._element,
      alpha: false
    });
    this._renderer.toneMapping = LinearToneMapping;
    console.log(this._element);
    this.resize();
    this._renderer.setClearColor(0x000000, 1);
    this._renderer.setPixelRatio(1);
    this._renderer.setSize(this._viewportWidth, this._viewportHeight);

    this._camera = new PerspectiveCamera(35, this._viewportWidth / this._viewportHeight, 1, 25000);
    this._camera.position.z = -10;

    // this.startExperience();
    xhrRequest('assets/config.json', {json: true}, this._onConfigLoaded.bind(this));

    this._element.addEventListener('mousemove', this._onMouseMove.bind(this));
    this._element.addEventListener('mousedown', this._onMouseDown.bind(this));
    this._element.addEventListener('mouseup', this._onMouseUp.bind(this));

    this._element.addEventListener('touchmove', this._onMouseMove.bind(this));
    this._element.addEventListener('touchstart', this._onMouseDown.bind(this));
    this._element.addEventListener('touchend', this._onMouseUp.bind(this));
    return true;
  }

  startExperience() {
    this._experienceStarted = true;
    this._onPlayClick();

    TweenMax.to(this._tunnel.position, 5, {
      z: 0,
      ease: Power4.easeOut
      // onComplete: ()=> {
      //   this._initAudio();
      // }
    });
    TweenMax.to(this._blob.position, 7, {
      z: -5,
      ease: Power4.easeOut
    });
  }

  _onPlayClick() {
    if (this._pauseTime !== 0) {
      this._startTime += (new Date().getTime() - this._pauseTime);
    }
    this._isPlaying = true;
    this._pauseButton.style.display = '';
    this._playButton.style.display = 'none';

    for (let sourceName in this._soundSources) {
      this._soundSources[sourceName].analyser = analyser(this._soundSources[sourceName]);

      this._loadedAudioTracks += 1;
      this._maxFreq = 0;

      if (this._loadedAudioTracks === this._audioComponents.length) {
        this._startTime = new Date().getTime();
        this._pauseTime = 0;
        this._audioReady = true;
        this._onPauseClick();
        TweenMax.to(this._startExperienceButton, 0.5, {opacity: 1, display: 'block'});
      }

      this._soundSources[sourceName].play();
    }
  }
  _onPauseClick() {

    this._pauseTime = new Date().getTime();
    this._isPlaying = false;
    if (this._experienceStarted) {
      this._pauseButton.style.display = 'none';
      this._playButton.style.display = '';
    }

    for (let sourceName in this._soundSources) {
      this._soundSources[sourceName].pause();
    }
  }

  _showGUI() {
    if (this._gui) {
      return;
    }
    this._gui = new dat.GUI();

    this._gui.add(this._params, 'exposure', 0.1, 2).listen().step(0.1);
    this._gui.add(this._params, 'wireframe').listen();
    this._gui.addColor(this._params, 'bgColor').listen();
    this._gui.add(this._params, 'cameraBaseRotation', 0, 2).name('cam rot base').listen().step(0.1);
    this._gui.add(this._params, 'cameraReactiveRotation', 0, 2).name('cam rot reactive').listen().step(0.1);
    this._gui.add(this._params, 'bassCutOff', 0, 1).name('bass cutoff').listen().step(0.1);

    let blobParams = this._gui.addFolder('blob');
    let tunnelParams = this._gui.addFolder('tunnel');
    let bloomParams = this._gui.addFolder('bloom');

    tunnelParams.add(this._params, 'tunnelBaseSpeed', 0, 4).name('base speed').listen().step(0.1);
    tunnelParams.add(this._params, 'tunnelReactiveSpeed', 0, 4).name('reactive speed').listen().step(0.1);
    tunnelParams.add(this._params, 'tunnelTextureRotateBase', 0, 4).name('tex rot base').listen().step(0.1);
    tunnelParams.add(this._params, 'tunnelTextureRotateReactive', 0, 4).name('tex rot reactive').listen().step(0.1);
    tunnelParams.add(this._params, 'tunnelTextureMix', 0, 1).name('tex mix').listen().step(0.1);

    tunnelParams.add(this, '_changeTexture1').name('texture1');
    tunnelParams.add(this, '_changeTexture2').name('texture2');

    blobParams.add(this._params, 'blobReactiveness', 0, 2).name('reactive').listen().step(0.1);
    blobParams.add(this._params, 'blobReflectiveness', 0, 1).name('reflective').listen().step(0.1);
    blobParams.addColor(this._params, 'blobColor').name('color').listen();
    blobParams.add(this._params, 'blobHighlight', 0, 3).name('highlight').listen().step(0.1);

    bloomParams.add(this._params, 'bloomThreshold', 0.0, 1.0).name('threshold').listen().step(0.1);
    bloomParams.add(this._params, 'bloomStrength', 0.0, 5).name('base strenght').listen().step(0.1);
    bloomParams.add(this._params, 'bloomReactiveness', 0, 5).name('strenght reactive').listen().step(0.1);
    bloomParams.add(this._params, 'bloomRadius', 0.0, 1.0).name('radius').listen().step(0.1);

    this._gui.open();
  }

  _onKeyPress(event) {

    console.log(event);

    if (event.code.toLowerCase() === 'keys' && event.shiftKey) {
      this.showStats();
    }
    if (event.code.toLowerCase() === 'keyd' && event.shiftKey) {
      this._showGUI();
    }

    if (event.code.toLowerCase() === 'space') {
      if (this._isPlaying) {
        this._onPauseClick();
      } else {
        this._onPlayClick();
      }
    }
  }
  _onRestartClick() {

  }

  _onConfigLoaded(err, data) {
    if (err) {
      return;
    }

    this._data = data;

    // set initial parameters
    for (let name in data.scenes[0]) {

      if (name.toLowerCase().indexOf('color') !== -1) {
        // data.scenes[0][name] = parseInt(data.scenes[0][name], 16);
        TweenMax.to(this._params, 0, {colorProps: {name: data.scenes[0][name]}});
      }
      this._params[name] = data.scenes[0][name];
    }

    this._tunnel = this._createTunnel();

    this._initAudio();
    this._initPostProcessing();
    this._blob = this._initBlob();

    this._render();

    this._tunnel.position.z = -2000;
    this._blob.position.z = -2000;
  }

  _transitionScene(params) {
    this._startTime = new Date().getTime();
    this._currentScene++;

    let obj = {};

    for (let name in params) {

      if (typeof params[name] === 'boolean') {
        this._params[name] = params[name];
      }

      if (name.toLowerCase().indexOf('color') !== -1) {
        // params[name] = parseInt(params[name], 16);
        if (!obj.colorProps) {
          obj.colorProps = {};
        }
        obj.colorProps[name] = params[name];

      } else if (typeof params[name] === 'number') {
        obj[name] = params[name];
      }

      if (name === 'texture1') {
        this._tunnelMaterial.uniforms.map.value = this._textureLoader.load(params[name]);
        this._tunnelMaterial.uniforms.map.value.wrapS = RepeatWrapping;
        this._tunnelMaterial.uniforms.map.value.wrapT = RepeatWrapping;
      }
      if (name === 'texture1b') {
        this._tunnelMaterial.uniforms.mapb.value = this._textureLoader.load(params[name]);
        this._tunnelMaterial.uniforms.mapb.value.wrapS = RepeatWrapping;
        this._tunnelMaterial.uniforms.mapb.value.wrapT = RepeatWrapping;
      }
      if (name === 'texture2') {
        this._tunnelMaterial.uniforms.map2.value = this._textureLoader.load(params[name]);
        this._tunnelMaterial.uniforms.map2.value.wrapS = RepeatWrapping;
        this._tunnelMaterial.uniforms.map2.value.wrapT = RepeatWrapping;
      }
      if (name === 'texture2b') {
        this._tunnelMaterial.uniforms.map2b.value = this._textureLoader.load(params[name]);
        this._tunnelMaterial.uniforms.map2b.value.wrapS = RepeatWrapping;
        this._tunnelMaterial.uniforms.map2b.value.wrapT = RepeatWrapping;
      }

    }

    // switch textures
    if (this._currentScene % 2 === 0) {
      obj.tunnelTextureMix = 0;
    } else {
      obj.tunnelTextureMix = 1;
    }

    TweenMax.to(this._params, 2, obj);

  }

  _initfileDialog() {
    let dialog = document.createElement('input');

    dialog.type = 'file';
    dialog.style.position = 'absolute';
    dialog.style.top = '100px';
    dialog.style.width = '100px';
    dialog.style.height = '100px';

    if (dialog.onclick) {
      dialog.onclick();
    } else if (dialog.click) {
      dialog.click();
    }
    return dialog;
  }

  _readURL(input, onload) {
    if (input.files && input.files[0]) {
      let reader = new FileReader();

      reader.onload = onload;
      reader.readAsDataURL(input.files[0]);
    }
  }
  _readImage(result, onload) {
    let img = document.createElement('img');

    img.onload = onload;
    img.src = result;
  }

  _changeTexture1() {
    let dialog = this._initfileDialog();

    dialog.onchange = (event)=> {
      this._readURL(event.target, (e) => {
        this._readImage(e.target.result, (e) => {
          this._tunnelMaterial.uniforms.map.value.image = e.target;
          this._tunnelMaterial.uniforms.map.value.needsUpdate = true;
        });
      });
    };
  }
  _changeTexture2() {
    let dialog = this._initfileDialog();

    dialog.onchange = (event)=> {
      this._readURL(event.target, (e) => {
        this._readImage(e.target.result, (e) => {
          this._tunnelMaterial.uniforms.map2.value.image = e.target;
          this._tunnelMaterial.uniforms.map2.value.needsUpdate = true;
        });
      });
    };
  }

  _initBlob() {
    this._cubeCamera1 = new CubeCamera(1, 1000, 256);
    this._cubeCamera1.position.z = -5;
    this._cubeCamera1.rotation.y = Math.PI / 2;
    this._cubeCamera1.renderTarget.texture.minFilter = LinearMipMapLinearFilter;

    // let cubetexLoader = new CubeTextureLoader();

    // cubetexLoader.setPath('/assets/images/cube/');

    this._blobMaterial = new ShaderMaterial({
      uniforms: {
        iGlobalTime: {
          type: 'f',
          value: 0
        },
        lightIntensity: {
          type: 'f',
          value: this._params.blobHighlight
        },
        reflectiveness: {
          type: 'f',
          value: this._params.blobReflectiveness
        },
        blobColor: {
          type: 'c',
          value: new Color(this._params.blobColor)
        },
        envMap: {
          type: 't',
          value: this._cubeCamera1.renderTarget.texture
        }
      },
      vertexShader: blobVert,
      fragmentShader: blobFrag,
      transparent: true,
      // blending: SubtractiveBlending,
      // wireframe: true,
      side: DoubleSide
    });
    let plane = new Mesh(new PlaneBufferGeometry(4, 4), this._blobMaterial);

    plane.rotation.z = Math.PI;
    plane.position.z = -5;

    plane.add(this._cubeCamera1);
    this._camera.add(plane);
    this._scene.add(this._camera);
    return plane;
  }

  _initPostProcessing() {
    let res = new Vector2(this._viewportWidth, this._viewportHeight);

    this._bloomPass = new THREE.UnrealBloomPass(
      res,
      this._params.bloomStrength,
      this._params.bloomRadius,
      this._params.bloomThreshold
    );

    let renderScene = new THREE.RenderPass(this._scene, this._camera);
    let copyShader = new THREE.ShaderPass(THREE.CopyShader);
    // let effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);

    copyShader.renderToScreen = true;
    // effectFXAA.uniforms['resolution'].value.set(1 / this._viewportWidth, 1 / this._viewportHeight);

    this._composer = new THREE.EffectComposer(this._renderer);
    this._composer.setSize(this._viewportWidth, this._viewportHeight);
    this._composer.addPass(renderScene);
    // this._composer.addPass(effectFXAA);
    this._composer.addPass(this._bloomPass);
    this._composer.addPass(copyShader);
    this._renderer.gammaInput = true;
    this._renderer.gammaOutput = true;

  }

  _onAudioTrackEnded() {
    TweenMax.to(this._element, 2, {
      opacity: 0,
      onComplete: () => {
        window.location.reload();
      }
    });
  }

  _initParticles() {

  }

  _initAudio() {

    this._audioComponents = ['bass', 'vocals', 'melody'];
    this._soundSources = {};
    this._loadedAudioTracks = 0;
    // this._minimumFrequencyScale = 20;
    // this._frequencyAttenuation = 50;

    let components = this._audioComponents;

    for (let i = 0; i < components.length; i++) {
      let current = components[i];

      this._soundSources[current] = document.createElement('audio');

      this._soundSources[current].autoplay = false;
      this._soundSources[current].src = 'assets/audio/' + current + '.mp3';

      if (i === 0) {
        this._soundSources[current].addEventListener('ended', this._onAudioTrackEnded.bind(this));
      }

      this._soundSources[current].addEventListener('canplay', () => {
        this._soundSources[current].loaded = true;
        this._soundSources[current].volume = 1.0;
      });
    }
  }

  _getAverageValue(source) {
    let freq = source.analyser.frequencies();
    let sum = 0;

    for (let i = 0; i < freq.length; i++) {
      sum += freq[i];
    }

    sum /= freq.length;

    // this._maxFreq = Math.max(sum, this._maxFreq);
    // console.log(this._maxFreq);

    // sum = Math.max(this._minimumFrequencyScale, sum);

    return sum / 100;
  }

  _createTunnel() {
    // let container = new Object3D();

    let planeGeometry = new PlaneGeometry(10, this._tunnelLenght, 10, this._tunnelLenght);

    for (let i = 0; i < planeGeometry.vertices.length; i++) {
      planeGeometry.vertices[i].y -= this._tunnelLenght / 2;
    }
    planeGeometry.verticesNeedUpdate = true;

    let map1 = this._textureLoader.load(this._params.texture1);
    let map1b = this._textureLoader.load(this._params.texture1b);
    let map2 = this._textureLoader.load(this._params.texture2);
    let map2b = this._textureLoader.load(this._params.texture2b);

    map1.wrapS =
    map1.wrapT =
    map1b.wrapS =
    map1b.wrapT =
    map2.wrapS =
    map2.wrapT =
    map2b.wrapS =
    map2b.wrapT = RepeatWrapping;

    this._tunnelMaterial = new ShaderMaterial({
      uniforms: {
        map: {
          type: 't',
          value: map1
        },
        mapb: {
          type: 't',
          value: map1b
        },
        map2: {
          type: 't',
          value: map2
        },
        map2b: {
          type: 't',
          value: map2b
        },
        mapReactive: {
          type: 'f',
          value: 0
        },
        fogColor: {
          type: 'c',
          value: new Color(0, 0, 0)
        },
        tunnelLenght: {
          type: 'f',
          value: this._tunnelLenght
        },
        offsetRepeat: {
          type: 'v4',
          value: new Vector4(0, 0, 1, 4)
        },
        opacity: {
          type: 'f',
          value: 0.3
        },
        mapMix: {
          type: 'f',
          value: 0
        },
        distortion: {
          type: 'v2',
          value: new Vector2(0, 0)
        }
      },
      vertexShader: tunnelVert,
      fragmentShader: tunnelFrag,
      transparent: false,
      // wireframe: true,
      side: DoubleSide
    });

    // this._tunnelMaterial = new MeshBasicMaterial({
    //   color: 0xffffff,
    //   side: DoubleSide,
    //   map: this._textureLoader.load('assets/images/dea60ce67a5bb55100ba6a7b1b1620fe.jpg'),
    //   transparent: true
    // });

    // floor plane
    let plane1 = new Mesh(planeGeometry, this._tunnelMaterial);

    plane1.rotation.x = Math.PI / 2;
    plane1.rotation.y = 180 * Math.PI / 180;
    plane1.position.y = -3;
    // container.add(plane1);

    // left plane
    let plane2 = new Mesh(planeGeometry, this._tunnelMaterial);

    plane2.rotation.x = Math.PI / 2;
    plane2.rotation.y = 60 * Math.PI / 180;
    plane2.position.x = -2.5;
    plane2.position.y = 1.33;
    // container.add(plane2);

    // // right plane
    let plane3 = new Mesh(planeGeometry, this._tunnelMaterial);

    plane3.rotation.x = Math.PI / 2;
    plane3.rotation.y = -60 * Math.PI / 180;
    plane3.position.x = 2.5;
    plane3.position.y = 1.33;
    // container.add(plane3);

    let merged = new Geometry();

    merged.mergeMesh(plane1);
    merged.mergeMesh(plane2);
    merged.mergeMesh(plane3);

    let tunnel = new Mesh(merged, this._tunnelMaterial);

    // container.add(tunnel);

    this._scene.add(tunnel);

    return tunnel;
  }

  hideStats() {
    this.stats.dom.parentNode.removeChild(this.stats.dom);
  }
  showStats() {
    if (!this.stats) {
      this.stats = new Stats();
    }
    document.body.appendChild(this.stats.dom);
  }

  _render() {
    if (this._destroyed) {
      return;
    }
    let delta = this._clock.getDelta();
    let delta1 = delta * 60;

    this._renderer.toneMappingExposure = Math.pow(this._params.exposure, 4.0);

    let bassFreq = 0;
    let vocalsFreq = 0;

    if (this._audioReady && this._isPlaying) {

      bassFreq = this._getAverageValue(this._soundSources.bass);
      // let melodyFreq = this._getAverageValue(this._soundSources.melody);
      vocalsFreq = this._getAverageValue(this._soundSources.vocals);

      if (this._data.scenes.length > this._currentScene + 1) {
        // a next scene exists
        let diff = (new Date().getTime() - this._startTime) / 1000;

        // console.log('diff', diff);
        if (diff > this._data.scenes[this._currentScene + 1].start) {
          this._transitionScene(this._data.scenes[this._currentScene + 1]);
        }
      }
    }
    // let bassCut = 0.3;
    // let vocalsCut = 0.6;

    let bassCutOff = Math.max(0, (bassFreq - this._params.bassCutOff) * (1 / (1 - this._params.bassCutOff)));
    // let vocalsCutOff = Math.max(0, (vocalsFreq - this._params.vocalsCutOff) * (1 / (1 - this._params.vocalsCutOff)));

    // console.log(vocalsCutOff);
      // console.log(bassFreq);

    if (this._isPlaying) {

      this._blobMaterial.uniforms.iGlobalTime.value +=
        (delta * 0.5) + (bassFreq * this._params.blobReactiveness) * 0.04;

      let tunnelOffsetRepeat = this._tunnelMaterial.uniforms.offsetRepeat.value;

      tunnelOffsetRepeat.y -=
        (this._params.tunnelBaseSpeed * 0.01 * delta1) +
        (bassFreq * this._params.tunnelReactiveSpeed * 0.013);

      tunnelOffsetRepeat.x -=
        (this._params.tunnelTextureRotateBase * 0.001 * delta1) +
        (bassFreq * this._params.tunnelTextureRotateReactive * 0.005);

      this._camera.rotation.z +=
        (this._params.cameraBaseRotation * 0.01 * delta1) +
        (vocalsFreq * this._params.cameraReactiveRotation * 0.01);

      this._reactiveBloom = bassFreq * this._params.bloomReactiveness * 0.5;

      this._bloomPass.strength = this._params.bloomStrength + this._reactiveBloom;

      if (this._params.interactive) {
        this._elasticMousePickingPosition.x = this._mousePickingPosition.x;
        this._elasticMousePickingPosition.y = this._mousePickingPosition.y;
        this._elasticMousePickingPosition.update(delta);

        let xRotMouse = this._elasticMousePickingPosition.value.x * 120;
        let yRotMouse = this._elasticMousePickingPosition.value.y * 60;

        // rotate the point with the camera
        this._tunnelMaterial.uniforms.distortion.value.x =
          xRotMouse * Math.cos(this._camera.rotation.z) - yRotMouse * Math.sin(this._camera.rotation.z);
        this._tunnelMaterial.uniforms.distortion.value.y =
          yRotMouse * Math.cos(this._camera.rotation.z) + xRotMouse * Math.sin(this._camera.rotation.z);
      }

      this._tunnelMaterial.uniforms.mapMix.value = this._params.tunnelTextureMix;

      this._tunnelMaterial.uniforms.mapReactive.value = bassCutOff;
      this._tunnelMaterial.wireframe = this._params.wireframe;
      this._tunnelMaterial.uniforms.fogColor.value.setStyle(this._params.bgColor);

      this._bgColor.setStyle(this._params.bgColor);
      this._renderer.setClearColor(this._bgColor.getHex(), 1);

      this._blobMaterial.uniforms.reflectiveness.value = this._params.blobReflectiveness;
      this._blobMaterial.uniforms.blobColor.value.setStyle(this._params.blobColor);
      this._blobMaterial.uniforms.lightIntensity.value = this._params.blobHighlight;
      this._bloomPass.threshold = this._params.bloomThreshold;
      this._bloomPass.radius = this._params.bloomRadius;
    }

    if (!this._composer) {
      this._renderer.render(this._scene, this._camera);
    } else {
      this._composer.render();
    }

    this._camera.visible = false;
    this._cubeCamera1.updateCubeMap(this._renderer, this._scene);
    this._camera.visible = true;

    // picking
    this._raycaster.setFromCamera(this._mousePickingPosition, this._camera);
    // let intersections = this._raycaster.intersectObjects(this._pins, true);

    // this._camera.lookAt(this._scene.position);

    if (this.stats) {
      this.stats.update();
    }

    requestAnimationFrame(this._render.bind(this));
  }

  _getMousePositionX(event) {
    if (event.touches && event.touches.length > 0) {
      return event.touches[0].pageX - event.touches[0].target.offsetLeft;
    }
    return event.offsetX;
  }

  _getMousePositionY(event) {
    if (event.touches && event.touches.length > 0) {
      return event.touches[0].pageY - event.touches[0].target.offsetTop;
    }
    return event.offsetY;
  }

  _updateMousePosition(event) {
    this._mousePosition.x = this._getMousePositionX(event);
    this._mousePosition.y = this._getMousePositionY(event);

    this._mousePickingPosition.x = (this._mousePosition.x / this._viewportWidth) * 2 - 1;
    this._mousePickingPosition.y = -(this._mousePosition.y / this._viewportHeight) * 2 + 1;
  }

  _onMouseMove(event) {
    this._updateMousePosition(event);
    event.preventDefault();
  }

  _onMouseDown(event) {
    this.isMouseDown = true;
    this._updateMousePosition(event);
    this._mouseDownPosition.copy(this._mousePosition);
    // this._phiThetaDownPosition.copy(this._phiTheta);
  }

  _onMouseUp(event) {
    this.isMouseDown = false;

    if (this._overPin) {
      this.zoom(this._overPin.controller.pinId);
    }
  }

  _clamp(number, min, max) {
    return Math.max(min, Math.min(max, number));
  }

  _shortestAngle(targetA, sourceA) {
    let a = targetA - sourceA;

    return this._absmod(a + Math.PI, Math.PI * 2) - Math.PI;
  }
  _absmod(number, max) {
    return ((number % max) + max) % max;
  }

  resize(w, h) {
    this._viewportWidth = w || this._element.width;
    this._viewportHeight = h || this._element.height;

    if (this._renderer) {
      this._renderer.setPixelRatio(1);
      this._renderer.setSize(this._viewportWidth, this._viewportHeight);
    }

    if (this._camera) {
      this._camera.aspect = this._viewportWidth / this._viewportHeight;
      this._camera.updateProjectionMatrix();
    }

    if (this._composer && this._renderer) {
      this._composer.setSize(this._viewportWidth, this._viewportHeight);
    }
  }

  get name() {
    return this._name;
  }

}
