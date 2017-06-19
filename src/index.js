import * as PIXI from 'pixi.js';
// import { TweenLite } from 'gsap';

import AudioReactive from './AudioReactive';
import Detector from 'three/examples/js/Detector';
import Stats from 'three/examples/js/libs/stats.min';

import Sphere from './Sphere';
import { mat4, vec3 } from 'gl-matrix';
import OrbitalCameraControl from './OrbitalCameraControl';

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

  _setupSphere() {
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

    const rad = Math.PI / 180;
    const ratio = this._width / this._height;

    mat4.perspective(this._proj, 45 * rad, ratio, 0.1, 100);

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

    this._stage = new PIXI.Container();
    mesh.state.depthTest = true;
    this._stage.addChild(mesh);
  }

  _render() {
    if (this._destroyed) {
      return;
    }

    vec3.transformMat4(this._screenPos, this._tagPos, this._view);
    vec3.transformMat4(this._screenPos, this._screenPos, this._proj);

    // this._uniforms.color = this._audio.getAverageValue();

    this._camera.update();
    this._renderer.render(this._stage);
    requestAnimationFrame(this._render.bind(this));
  }

  startExperience() {
    this._renderer = PIXI.autoDetectRenderer(this._width, this._height, { transparent: true, antialias: true });
    document.body.appendChild(this._renderer.view);

    // this._setupWebGLSchene();
    this._setupSphere();
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
