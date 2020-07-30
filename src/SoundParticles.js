// import { Application, Shader, Mesh, Geometry, Container, DRAW_MODES } from 'pixi.js';

// import vertBackground from '@/glsl/background.vert';
// import fragBackground from '@/glsl/background.frag';

// import vertParticles from '@/glsl/particles.vert';
// import fragParticles from '@/glsl/particles.frag';

// import CameraControls from '@/CameraControls';
import AudioReactive from '@/AudioReactive';

import { mat4 } from 'gl-matrix';
const RAD = Math.PI / 180;

export default class SoundParticles {
  constructor (canvas, track) {
    this.canvas = canvas;
    this.audio = new AudioReactive(track);
    this.audio.setSongFrequencies({ min: 510.5, max: 621.5 });

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.ratio = this.width / this.height;

    this.destroyed = false;
    this.startTime = null;
    this.PARTICLES = 1024;

    this.audio.load();
  }

  start () {
    this.startTime = Date.now() + 50;
    this.audio.play(this.render.bind(this));
  }

  render () {
    this.frame = requestAnimationFrame(this.render.bind(this));
    console.log(this.audio.getAudioProgress(), this.audio.getFrequencyValues());
  }

  onResize () {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.ratio = this.width / this.height;
    this.backgroundUniforms.aspect = this.ratio;

    this.renderer.view.style.width = `${this.width}px`;
    this.renderer.view.style.height = `${this.height}px`;

    mat4.perspective(this.proj, 45 * RAD, this.ratio, 0.1, 100);
  }
}
