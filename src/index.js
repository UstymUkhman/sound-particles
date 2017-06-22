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
const PARTICLES = 1024;

export default class SoundParticles {

  constructor() {
    this._audio = new AudioReactive('assets/John Newman - Love Me Again.mp3');
    this._name = 'SoundParticles';

    this._height = window.innerHeight;
    this._width = window.innerWidth;

    this._ratio = this._width / this._height;
    this._destroyed = false;

    return !!Detector.webgl;
  }

  _getRandomFromRange(min, max) {
    return min + Math.random() * (max - min);
  }

  _createSphere() {
    // this._view = mat4.create();
    // this._proj = mat4.create();

    this._screenPos = vec3.create();
    this._camera = new OrbitalCameraControl(this._view, 50);
    this._tagPos = vec3.fromValues(Math.cos(PI_2) * 10, 0, Math.sin(PI_2) * 10);

    const { positions, uvs, indices } = Sphere;
    const geometry = new PIXI.mesh.Geometry()
              .addAttribute('aVertexPosition', positions, 3)
              .addAttribute('aUV', uvs, 2)
              .addIndex(indices);

    // mat4.perspective(this._proj, 45 * RAD, this._ratio, 0.1, 100);

    const texture = PIXI.Texture.from('assets/gradient.jpg');
    const view = this._view;
    const proj = this._proj;

    this._uniforms = {
      uPosition: [0, 0, 0], uScale: 10,
      texture, view, proj
    };

    const vs = require('./shaders/sphere.vert');
    const fs = require('./shaders/sphere.frag');

    const shader = PIXI.Shader.from(vs, fs, this._uniforms);
    const sphere = new PIXI.mesh.RawMesh(geometry, shader);

    sphere.state.depthTest = true;
    this._stage.addChild(sphere);
  }

  _createParticles() {
    let indices = [];
    let frequencies = [];
    let particlesUVs = [];

    const MAX_FREQ = 2;
    let minFrequencies = [];
    let maxFrequencies = [];

    let particlesOffset = 2.0 / PARTICLES;
    let random = Math.random() * PARTICLES;
    let step = Math.PI * (5.0 - Math.sqrt(5)); // 8.0 - ...

    for (let i = 0; i < PARTICLES; i++) {
      const minY = ((i * particlesOffset) - 1) + (particlesOffset / 2);
      const radius = Math.sqrt(1 - Math.pow(minY, 2));

      const phi = ((i + random) % PARTICLES) * step;
      const uv = i / PARTICLES;

      const minX = Math.cos(phi) * radius;
      const minZ = Math.sin(phi) * radius;

      const maxX = minX * MAX_FREQ;
      const maxY = minY * MAX_FREQ;
      const maxZ = minZ * MAX_FREQ;

      maxFrequencies = maxFrequencies.concat([maxX, maxY, maxZ]);
      minFrequencies = minFrequencies.concat([minX, minY, minZ]);

      particlesUVs = particlesUVs.concat([uv, uv]);
      frequencies.push(i / PARTICLES);
      indices.push(i);
    }

    const fbo0 = this._fbo0;
    const view = this._view;
    const proj = this._proj;

    this._uniforms = {
      texture: fbo0.colorTextures[2],
      frequencies: frequencies,
      // direction: 1.0,
      view, proj
      // time: 0.0
    };

    const vsRender = require('./shaders/particles.vert');
    const fsRender = require('./shaders/particles.frag');

    const particlesGeometry = new PIXI.mesh.Geometry()
      .addAttribute('startPosition', minFrequencies, 3)
      .addAttribute('endPosition', maxFrequencies, 3)
      .addAttribute('aTextureCoord', particlesUVs, 2)
      .addAttribute('index', indices)
      .addIndex(indices);

    const shaderRender = PIXI.Shader.from(vsRender, fsRender, this._uniforms);

    return new PIXI.mesh.RawMesh(particlesGeometry, shaderRender, null, PIXI.DRAW_MODES.POINTS);
  }

  _createParticlesSphere() {
    const range = 4;
    const posData = new Float32Array(4 * PARTICLES * PARTICLES);
    const velData = new Float32Array(4 * PARTICLES * PARTICLES);
    const extraData = new Float32Array(4 * PARTICLES * PARTICLES);

    for (let i = 0; i < posData.length; i += 4) {
      posData[i + 0] = this._getRandomFromRange(-range, range);
      posData[i + 1] = this._getRandomFromRange(-range, range);
      posData[i + 2] = this._getRandomFromRange(-range, range);
      posData[i + 3] = 1;

      extraData[i + 0] = Math.random();
      extraData[i + 1] = Math.random();
      extraData[i + 2] = Math.random();
      extraData[i + 3] = 1;
    }

    this._fbo0 = new PIXI.FrameBuffer(PARTICLES, PARTICLES)
      .addColorTexture(0, new PIXI.BaseTexture.fromFloat32Array(PARTICLES, PARTICLES, posData))
      .addColorTexture(1, new PIXI.BaseTexture.fromFloat32Array(PARTICLES, PARTICLES, velData))
      .addColorTexture(2, new PIXI.BaseTexture.fromFloat32Array(PARTICLES, PARTICLES, extraData));

    this._fbo1 = new PIXI.FrameBuffer(PARTICLES, PARTICLES)
      .addColorTexture(0, new PIXI.BaseTexture.fromFloat32Array(PARTICLES, PARTICLES, posData))
      .addColorTexture(1, new PIXI.BaseTexture.fromFloat32Array(PARTICLES, PARTICLES, velData))
      .addColorTexture(2, new PIXI.BaseTexture.fromFloat32Array(PARTICLES, PARTICLES, extraData));

    this._fbo0.colorTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this._fbo1.colorTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    this._fbo0.colorTexture.wrapMode = PIXI.WRAP_MODES.CLAMP;
    this._fbo1.colorTexture.wrapMode = PIXI.WRAP_MODES.CLAMP;

    const particles = this._createParticles();

    particles.state.depthTest = true;
    this._stage.addChild(particles);
    this._flop = this._fbo0;

    const vsSim = require('./shaders/freq.vert');
    const fsSim = require('./shaders/freq.frag');
    // const fbo0 = this._fbo0;

    /* this._uniformsSim = {
      time: Math.random() * 255,
      texturePos: fbo0.colorTextures[0],
      textureVel: fbo0.colorTextures[1],
      textureExtra: fbo0.colorTextures[2]
    }; */

    this._uniformsSim = {
      time: 0
    };

    const squareCoords = [-1, 1, 0, 1, 1, 0, 1, -1, 0, -1, -1, 0];
    const squareUVs = [0, 1, 1, 1, 1, 0, 0, 0];
    const squareIndices = [0, 1, 2, 0, 2, 3];

    const geometryQuad = new PIXI.mesh.Geometry()
      .addAttribute('vertexPositions', squareCoords, 3)
      .addAttribute('aTextureCoord', squareUVs, 2)
      .addIndex(squareIndices);

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
    this._uniforms.frequencies = this._audio.getFrequencyValues();
    // this._time += 0.01;

    // const change = Math.floor(this._time);

    // if (change % 2) {
    //   this._uniforms.direction = 0.0;
    // } else {
    //   this._uniforms.direction = 1.0;
    // }

    this._camera.update();
    this._renderer.render(this._stage);
    requestAnimationFrame(this._render.bind(this));
  }

  startExperience() {
    this._view = mat4.create();
    this._proj = mat4.create();

    mat4.perspective(this._proj, 45 * RAD, this._ratio, 0.1, 100);

    this._stage = new PIXI.Container();
    this._renderer = PIXI.autoDetectRenderer(
      this._width, this._height, {
        transparent: true,
        antialias: true
      });

    this._camera = new OrbitalCameraControl(this._view, 5);
    document.body.appendChild(this._renderer.view);

    // this._createSphere();
    // this._time = 0.0;
    this._createParticlesSphere();

    this._audio.play(this._render.bind(this));
    // this._audio.play();
    // this._render();
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

    this._ratio = this._width / this._height;
  }

  destroy() {
    this._destroyed = true;
  }
}
