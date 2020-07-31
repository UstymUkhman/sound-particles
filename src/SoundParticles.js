import { Application, Shader, Mesh, Geometry, Container, DRAW_MODES } from 'pixi.js';

import vertBackground from '@/glsl/background.vert';
import fragBackground from '@/glsl/background.frag';

import vertParticles from '@/glsl/particles.vert';
import fragParticles from '@/glsl/particles.frag';

import CameraControls from '@/CameraControls';
import AudioReactive from '@/AudioReactive';

import { mat4 } from 'gl-matrix';

const RAD = Math.PI / 180;
const PARTICLES = 1024;

export default class SoundParticles {
  constructor (track) {
    this.audio = new AudioReactive(track);
    this.ratio = window.innerWidth / window.innerHeight;
    this.audio.setSongFrequencies({ min: 510.5, max: 621.5 });

    this.runEasing = false;
    this.init();
  }

  init () {
    this.view = mat4.create();
    this.proj = mat4.create();

    mat4.perspective(this.proj, 45 * RAD, this.ratio, 0.1, 100);

    this.app = new Application({
      resolution: window.devicePixelRatio || 1,
      height: window.innerHeight,
      width: window.innerWidth,
      transparent: true,
      antialias: true
    });

    this.camera = new CameraControls(this.view, 5);
    this.app.stage.addChild(new Container());
    document.body.appendChild(this.app.view);

    this.createBackground();
    this.createParticles();
    this.audio.load();
  }

  createBackground () {
    const position = [-1, 1, -0.5, 1, 1, -0.5, 1, -1, -0.5, -1, -1, -0.5];
    const uvs = [0, 0, 1, 0, 1, 1, 0, 1];
    const indices = [0, 1, 2, 0, 2, 3];

    const geometry = new Geometry()
      .addAttribute('position', position, 3)
      .addAttribute('uv', uvs, 2)
      .addIndex(indices);

    this.backgroundUniforms = {
      aspect: this.ratio,
      progress: 0.0,
      dark: true
    };

    const shader = Shader.from(vertBackground, fragBackground, this.backgroundUniforms);
    const mesh = new Mesh(geometry, shader);
    this.app.stage.addChild(mesh);
  }

  createParticles () {
    const step = Math.PI * (5.0 - Math.sqrt(5));
    const rand = Math.random() * PARTICLES;
    const offset = 2.0 / PARTICLES;
    const distance = 1.5;

    const minFrequencies = [];
    const maxFrequencies = [];
    const frequencies = [];
    const indices = [];

    for (let i = 0; i < PARTICLES; i++) {
      const minY = (i * offset - 1) + offset / 2;
      const phi = ((i + rand) % PARTICLES) * step;
      const radius = Math.sqrt(1 - Math.pow(minY, 2));

      const freq = [
        Math.cos(phi) * radius / distance,
        minY / distance,
        Math.sin(phi) * radius / distance
      ];

      maxFrequencies.push(...freq.map(f => f * 2));
      minFrequencies.push(...freq);

      frequencies.push(i / PARTICLES);
      indices.push(i);
    }

    this.shuffleIndices(indices);

    this.particleUniforms = {
      view: this.view,
      proj: this.proj,
      frequencies,
      easing: 0.0,
      time: 0.0
    };

    const particlesGeometry = new Geometry()
      .addAttribute('startPosition', minFrequencies, 3)
      .addAttribute('endPosition', maxFrequencies, 3)
      .addAttribute('index', indices)
      .addIndex(indices);

    const shaderRender = Shader.from(vertParticles, fragParticles, this.particleUniforms);
    const particles = new Mesh(particlesGeometry, shaderRender, null, DRAW_MODES.POINTS);

    particles.state.depthTest = true;
    this.app.stage.addChild(particles);
  }

  shuffleIndices (indices) {
    let index = indices.length;

    while (index > 0) {
      const rand = Math.floor(Math.random() * index--);
      const temp = indices[index];

      indices[index] = indices[rand];
      indices[rand] = temp;
    }
  }

  start () {
    this.startTime = Date.now() + 50;
    this.audio.play(this.render.bind(this));
  }

  render () {
    this.frame = requestAnimationFrame(this.render.bind(this));
    const progTime = Math.abs(this.startTime - Date.now()) / 1000;

    if (this.runEasing && progTime > 48.5) {
      this.backgroundUniforms.dark = false;
      this.particleUniforms.easing = 0.0;
      this.runEasing = false;

    } else if (this.runEasing && progTime > 44.6) {
      this.particleUniforms.easing = 44.6;

    } else if (progTime > 40.8 && progTime < 48.5) {
      this.particleUniforms.easing = -40.8;
      this.runEasing = true;
    }

    this.particleUniforms.frequencies = this.audio.getFrequencyValues();
    this.backgroundUniforms.progress = this.audio.getAudioProgress();
    this.particleUniforms.time = progTime;

    this.camera.update();
    this.app.render();
  }

  resize () {
    this.app.view.style.height = `${window.innerHeight}px`;
    this.app.view.style.width = `${window.innerWidth}px`;

    this.ratio = window.innerWidth / window.innerHeight;
    this.backgroundUniforms.aspect = this.ratio;

    mat4.perspective(this.proj, 45 * RAD, this.ratio, 0.1, 100);
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}
