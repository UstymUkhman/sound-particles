import * as PIXI from 'pixi.js';
// import { TweenLite } from 'gsap';
import AudioReactive from './AudioReactive';
import Detector from 'three/examples/js/Detector';
import Stats from 'three/examples/js/libs/stats.min';

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
    this._renderer = PIXI.autoDetectRenderer(this._width, this._height, { transparent: true, antialias: true });
    document.body.appendChild(this._renderer.view);
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

  _render() {
    if (this._destroyed) {
      return;
    }

    this._uniforms.color = this._audio.getAverageValue();
    this._renderer.render(this._stage);

    requestAnimationFrame(this._render.bind(this));
  }

  startExperience() {
    this._setupWebGLSchene();
    this._audio.play(() => {
      this._render();
    });
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
