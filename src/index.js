import Sphere from './Sphere';
import * as PIXI from 'pixi.js';
import { mat4, vec3 } from 'gl-matrix';

import AudioReactive from './AudioReactive';
import Detector from 'three/examples/js/Detector';
import Stats from 'three/examples/js/libs/stats.min';
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

  /* _getRandomFromRange(min, max) {
    return min + Math.random() * (max - min);
  } */

  _createBackground() {
    const position = [-1, 1, -0.5, 1, 1, -0.5, 1, -1, -0.5, -1, -1, -0.5];
    const matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    const indices = [0, 1, 2, 0, 2, 3];
    const uvs = [0, 0, 1, 0, 1, 1, 0, 1];

    const geometry = new PIXI.mesh.Geometry()
      .addAttribute('position', position, 3)
      .addAttribute('uv', uvs, 2)
      .addIndex(indices);

    const vs = require('./shaders/background.vert');
    const fs = require('./shaders/background.frag');

    const view = this._view;
    const proj = this._proj;

    const uniforms = {
      aspect: this._ratio,
      projection: proj,
      model: matrix,
      view: view,

      color1: [1, 1, 1],
      color2: [0, 0, 0]
    };

    const shader = new PIXI.Shader.from(vs, fs, uniforms);
    const mesh = new PIXI.mesh.RawMesh(geometry, shader);

    this._stage.addChild(mesh);
  }

  _createSphere() {
    this._screenPos = vec3.create();
    this._camera = new OrbitalCameraControl(this._view, 50);
    this._tagPos = vec3.fromValues(Math.cos(PI_2) * 10, 0, Math.sin(PI_2) * 10);

    const { positions, uvs, indices } = Sphere;
    const geometry = new PIXI.mesh.Geometry()
              .addAttribute('aVertexPosition', positions, 3)
              .addAttribute('aUV', uvs, 2)
              .addIndex(indices);

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
      const minY = ((i * particlesOffset) - 1) + (particlesOffset / 2);
      const radius = Math.sqrt(1 - Math.pow(minY, 2));
      const phi = ((i + random) % PARTICLES) * step;

      const minX = Math.cos(phi) * radius;
      const minZ = Math.sin(phi) * radius;

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

    this._uniforms = {
      frequencies: frequencies,
      proj, view // ,
      // time: 0.0
    };

    const vsRender = require('./shaders/particles.vert');
    const fsRender = require('./shaders/particles.frag');

    const particlesGeometry = new PIXI.mesh.Geometry()
      .addAttribute('startPosition', minFrequencies, 3)
      .addAttribute('endPosition', maxFrequencies, 3)
      .addAttribute('index', indices)
      .addIndex(indices);

    const shaderRender = PIXI.Shader.from(vsRender, fsRender, this._uniforms);
    const particles = new PIXI.mesh.RawMesh(particlesGeometry, shaderRender, null, PIXI.DRAW_MODES.POINTS);

    particles.state.depthTest = true;
    this._stage.addChild(particles);
  }

  _render() {
    if (this._destroyed) {
      return;
    }

    // Sphere Rendering:
    // vec3.transformMat4(this._screenPos, this._tagPos, this._view);
    // vec3.transformMat4(this._screenPos, this._screenPos, this._proj);

    // Audioreactive Particles:
    // this._uniforms.time = +(this._uniforms.time + 0.01).toFixed(2);
    this._uniforms.frequencies = this._audio.getFrequencyValues();

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
    this._createBackground();
    this._createParticles();
    this._audio.play(this._render.bind(this));
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
