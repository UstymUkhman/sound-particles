import * as PIXI from 'pixi.js';
// import { TweenLite } from 'gsap';

import AudioReactive from './AudioReactive';
import Detector from 'three/examples/js/Detector';
import Stats from 'three/examples/js/libs/stats.min';

import Sphere from './Sphere';
import { mat4, vec3 } from 'gl-matrix';
import OrbitalCameraControl from './OrbitalCameraControl';

const RAD = Math.PI / 180;
const PI_2 = Math.PI / 2;

export default class SoundParticles {

  constructor() {
    this._audio = new AudioReactive('assets/John Newman - Love Me Again.mp3');
    this._name = 'SoundParticles';

    this._height = window.innerHeight;
    this._width = window.innerWidth;
    this._destroyed = false;

    return !!Detector.webgl;
  }

  _setupWebGLSchene() {
    this._uniforms = { color: 0.0 };

    const positions = [
      -1, 1, 0,
      1, 1, 0,
      0, 0, 0,
      -1, -1, 0,
      1, -1, 0
    ];

    const indices = [
      0, 1, 2,
      2, 3, 0,
      1, 2, 4,
      4, 2, 3
    ];

    const vert = require('./shaders/basic.vert');
    const frag = require('./shaders/basic.frag');

    const geometry = new PIXI.mesh.Geometry().addAttribute('vertexPositions', positions, 3).addIndex(indices);
    const shader = new PIXI.Shader.from(vert, frag, this._uniforms);
    const mesh = new PIXI.mesh.RawMesh(geometry, shader);

    this._stage = new PIXI.Container();
    this._stage.addChild(mesh);
  }

  _createSphere() {
    this._view = mat4.create();
    this._proj = mat4.create();

    this._screenPos = vec3.create();
    this._camera = new OrbitalCameraControl(this._view, 50);
    this._tagPos = vec3.fromValues(Math.cos(PI_2) * 10, 0, Math.sin(PI_2) * 10);

    const { positions, uvs, indices } = Sphere;
    const geometry = new PIXI.mesh.Geometry()
              .addAttribute('aVertexPosition', positions, 3)
              .addAttribute('aUV', uvs, 2)
              .addIndex(indices);

    const ratio = this._width / this._height;

    mat4.perspective(this._proj, 45 * RAD, ratio, 0.1, 100);

    const texture = PIXI.Texture.from('assets/gradient.jpg');
    const view = this._view;
    const proj = this._proj;

    this._uniforms = {
      uPosition: [0, 0, 0],
      uScale: 10,
      texture,
      view,
      proj
    };

    const vs = require('./shaders/sphere.vert');
    const fs = require('./shaders/sphere.frag');

    const shader = PIXI.Shader.from(vs, fs, this._uniforms);
    const mesh = new PIXI.mesh.RawMesh(geometry, shader);

    mesh.state.depthTest = true;
    return mesh;
  }

  _createParticles() {
    const numParticles = 64 * 2;
    const random = function (min, max) {
      return min + Math.random() * (max - min);
    };

    const view = mat4.create();
    const proj = mat4.create();
    const ratio = this._width / this._height;

    mat4.perspective(proj, 45 * RAD, ratio, 0.1, 100);

    const range = 4;
    const posData = new Float32Array(4 * numParticles * numParticles);
    const velData = new Float32Array(4 * numParticles * numParticles);
    const extraData = new Float32Array(4 * numParticles * numParticles);

    for (let i = 0; i < posData.length; i += 4) {
      posData[i + 0] = random(-range, range);
      posData[i + 1] = random(-range, range);
      posData[i + 2] = random(-range, range);
      posData[i + 3] = 1;

      extraData[i + 0] = Math.random();
      extraData[i + 1] = Math.random();
      extraData[i + 2] = Math.random();
      extraData[i + 3] = 1;
    }

    this._fbo0 = new PIXI.FrameBuffer(numParticles, numParticles)
      .addColorTexture(0, new PIXI.BaseTexture.fromFloat32Array(numParticles, numParticles, posData))
      .addColorTexture(1, new PIXI.BaseTexture.fromFloat32Array(numParticles, numParticles, velData))
      .addColorTexture(2, new PIXI.BaseTexture.fromFloat32Array(numParticles, numParticles, extraData));

    this._fbo1 = new PIXI.FrameBuffer(numParticles, numParticles)
      .addColorTexture(0, new PIXI.BaseTexture.fromFloat32Array(numParticles, numParticles, posData))
      .addColorTexture(1, new PIXI.BaseTexture.fromFloat32Array(numParticles, numParticles, velData))
      .addColorTexture(2, new PIXI.BaseTexture.fromFloat32Array(numParticles, numParticles, extraData));

    this._fbo0.colorTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this._fbo1.colorTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    this._fbo0.colorTexture.wrapMode = PIXI.WRAP_MODES.CLAMP;
    this._fbo1.colorTexture.wrapMode = PIXI.WRAP_MODES.CLAMP;

    let count = 0;
    let uvParticles = [];
    const fbo0 = this._fbo0;
    const indicesParticles = [];

    for (let i = 0; i < numParticles; i++) {
      for (let j = 0; j < numParticles; j++) {

        let u = i / numParticles + 0.5 / numParticles;
        let v = j / numParticles + 0.5 / numParticles;

        uvParticles = uvParticles.concat([u, v]);
        indicesParticles.push(count);
        count++;
      }
    }

    const geometryParticles = new PIXI.mesh.Geometry()
            .addAttribute('aTextureCoord', uvParticles, 2)
            .addIndex(indicesParticles);

    const vsRender = require('./shaders/render.vert');
    const fsRender = require('./shaders/render.frag');

    this._uniformsRender = {
      textureExtra: fbo0.colorTextures[2],
      texture: fbo0.colorTextures[0],
      view,
      proj
    };

    const shaderRender = PIXI.Shader.from(vsRender, fsRender, this._uniformsRender);

    this._particles = new PIXI.mesh.RawMesh(geometryParticles, shaderRender, null, PIXI.DRAW_MODES.POINTS);
    this._camera = new OrbitalCameraControl(this._view, 15);
    this._particles.state.depthTest = true;
    this._flop = this._fbo0;
  }

  _moveParticles() {
    let squareCoords = [-1, 1, 0, 1, 1, 0, 1, -1, 0, -1, -1, 0];
    let squareUVs = [0, 1, 1, 1, 1, 0, 0, 0];
    let squareIndices = [0, 1, 2, 0, 2, 3];

    const fbo0 = this._fbo0;

    const geometryQuad = new PIXI.mesh.Geometry()
      .addAttribute('vertexPositions', squareCoords, 3)
      .addAttribute('aTextureCoord', squareUVs, 2)
      .addIndex(squareIndices);

    const vsSim = require('./shaders/sim.vert');
    const fsSim = require('./shaders/sim.frag');

    this._uniformsSim = {
      time: Math.random() * 255,
      texturePos: fbo0.colorTextures[0],
      textureVel: fbo0.colorTextures[1],
      textureExtra: fbo0.colorTextures[2]
    };

    const shaderSim = PIXI.Shader.from(vsSim, fsSim, this._uniformsSim);

    this._simMesh = new PIXI.mesh.RawMesh(geometryQuad, shaderSim);
  }

  _renderSphere() {
    vec3.transformMat4(this._screenPos, this._tagPos, this._view);
    vec3.transformMat4(this._screenPos, this._screenPos, this._proj);
  }

  _renderParticles() {
    this._uniformsSim.texturePos = this._flop.colorTextures[0];
    this._uniformsSim.textureVel = this._flop.colorTextures[1];
    this._uniformsSim.textureExtra = this._flop.colorTextures[2];

    if (this._flop === this._fbo0) {
      this._flop = this._fbo1;
    } else {
      this._flop = this._fbo0;
    }

    this._uniformsSim.time += 0.005;

    this._renderer.framebuffer.bind(this._flop);
    this._renderer.framebuffer.clear();

    this._renderer.plugins.mesh.render(this._simMesh);
    this._renderer.framebuffer.bind(null);
  }

  _render() {
    if (this._destroyed) {
      return;
    }

    // this._renderSphere();
    this._renderParticles();

    // this._uniforms.color = this._audio.getAverageValue();

    this._camera.update();
    this._renderer.render(this._stage);
    requestAnimationFrame(this._render.bind(this));
  }

  startExperience() {
    this._renderer = PIXI.autoDetectRenderer(this._width, this._height, { transparent: true, antialias: true });
    document.body.appendChild(this._renderer.view);

    this._createParticles();

    // const sphere = this._createSphere();
    // this._setupWebGLSchene();
    this._stage = new PIXI.Container();
    this._moveParticles();

    // this._stage.addChild(sphere);
    this._stage.addChild(this._particles);
    this._render();

    // this._audio.play(() => {
    //   this._render();
    // });
  }

  showStats() {
    if (!this.stats) {
      this.stats = new Stats();
    }

    document.body.appendChild(this.stats.dom);
  }

  hideStats() {
    this.stats.dom.parentNode.removeChild(this.stats.dom);
  }

  resize(width, height) {
    this._width = width;
    this._height = height;

    this._renderer.view.width = this._width;
    this._renderer.view.height = this._height;
  }

  destroy() {
    this._destroyed = true;
  }
}
