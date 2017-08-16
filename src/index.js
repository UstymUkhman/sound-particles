import * as PIXI from 'pixi.js';
import { mat4 } from 'gl-matrix';

import AudioReactive from './AudioReactive';
import Detector from 'three/examples/js/Detector';
import OrbitalCameraControl from './OrbitalCameraControl';

const RAD = Math.PI / 180;
const PARTICLES = navigator.hardwareConcurrency < 4 ? 128 : 1024;

export default class SoundParticles {

  constructor() {
    this._audio = new AudioReactive('assets/John Newman - Love Me Again.mp3');
    this._audio.setSongFrequencies({ min: 510.5, max: 621.5 });

    this._height = window.innerHeight;
    this._width = window.innerWidth;

    this._ratio = this._width / this._height;
    this._destroyed = false;
    this._startTime = null;

    this._name = 'SoundParticles';
    return !!Detector.webgl;
  }

  _createBackground() {
    const position = [-1, 1, -0.5, 1, 1, -0.5, 1, -1, -0.5, -1, -1, -0.5];
    const indices = [0, 1, 2, 0, 2, 3];
    const uvs = [0, 0, 1, 0, 1, 1, 0, 1];

    const geometry = new PIXI.mesh.Geometry()
      .addAttribute('position', position, 3)
      .addAttribute('uv', uvs, 2)
      .addIndex(indices);

    const vs = require('./shaders/background.vert');
    const fs = require('./shaders/background.frag');

    this._backgroundUniforms = {
      aspect: this._ratio,
      progress: 0.0,
      dark: true
    };

    const shader = new PIXI.Shader.from(vs, fs, this._backgroundUniforms);
    const mesh = new PIXI.mesh.RawMesh(geometry, shader);

    this._stage.addChild(mesh);
  }

  _shuffleIndices(indices) {
    let index = indices.length;

    while (index > 0) {
      const rand = Math.floor(Math.random() * index);

      index -= 1;

      const temp = indices[index];

      indices[index] = indices[rand];
      indices[rand] = temp;
    }
  }

  _createParticles() {
    let indices = [];
    let frequencies = [];
    let minFrequencies = [];
    let maxFrequencies = [];

    let particlesOffset = 2.0 / PARTICLES;
    let random = Math.random() * PARTICLES;
    let step = Math.PI * (5.0 - Math.sqrt(5));

    for (let i = 0; i < PARTICLES; i++) {
      let minY = ((i * particlesOffset) - 1) + (particlesOffset / 2);
      const radius = Math.sqrt(1 - Math.pow(minY, 2));
      const phi = ((i + random) % PARTICLES) * step;

      let minX = Math.cos(phi) * radius;
      let minZ = Math.sin(phi) * radius;

      minX /= 1.5;
      minY /= 1.5;
      minZ /= 1.5;

      const maxX = minX * 2.0;
      const maxY = minY * 2.0;
      const maxZ = minZ * 2.0;

      maxFrequencies = maxFrequencies.concat([maxX, maxY, maxZ]);
      minFrequencies = minFrequencies.concat([minX, minY, minZ]);

      frequencies.push(i / PARTICLES);
      indices.push(i);
    }

    const view = this._view;
    const proj = this._proj;

    this._shuffleIndices(indices);

    this._particleUniforms = {
      frequencies: frequencies,
      easing: 0.0, time: 0.0,
      proj, view
    };

    const vsRender = require('./shaders/particles.vert');
    const fsRender = require('./shaders/particles.frag');

    const particlesGeometry = new PIXI.mesh.Geometry()
      .addAttribute('startPosition', minFrequencies, 3)
      .addAttribute('endPosition', maxFrequencies, 3)
      .addAttribute('index', indices)
      .addIndex(indices);

    const shaderRender = PIXI.Shader.from(vsRender, fsRender, this._particleUniforms);
    const particles = new PIXI.mesh.RawMesh(particlesGeometry, shaderRender, null, PIXI.DRAW_MODES.POINTS);

    particles.state.depthTest = true;
    this._stage.addChild(particles);
  }

  _render() {
    if (this._destroyed) {
      return;
    }

    const progTime = Math.abs(this._startTime - Date.now()) / 1000;

    if (this._runEasing && progTime > 48.5) {
      this._backgroundUniforms.dark = false;
      this._particleUniforms.easing = 0.0;
      this._runEasing = false;

    } else if (this._runEasing && progTime > 44.6) {
      this._particleUniforms.easing = 44.6;

    } else if (progTime > 40.8 && progTime < 48.5) {
      this._particleUniforms.easing = -40.8;
      this._runEasing = true;
    }

    this._particleUniforms.time = progTime;
    this._particleUniforms.frequencies = this._audio.getFrequencyValues();

    this._backgroundUniforms.progress = this._audio.getAudioProgress();

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

    this._createBackground();
    this._createParticles();

    this._runEasing = false;
    this._startTime = Date.now();
    this._audio.play(this._render.bind(this));
  }

  resize(width, height) {
    this._width = width;
    this._height = height;

    this._ratio = this._width / this._height;
    this._backgroundUniforms.aspect = this._ratio;

    this._renderer.view.style.width = this._width;
    this._renderer.view.style.height = this._height;

    mat4.perspective(this._proj, 45 * RAD, this._ratio, 0.1, 100);
  }

  destroy() {
    this._destroyed = true;
  }
}
