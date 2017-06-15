import Detector from 'three/examples/js/Detector';
import Stats from 'three/examples/js/libs/stats.min';
// import { TweenLite } from 'gsap';

const analyser = require('web-audio-analyser');

/*
  let max = 0

  for (let i = 0; i < soundSource.analyser.frequencies().length; i++) {
    max += (AnalyserNode.maxDecibels + i);
  }

  MAX_POWER = max / soundSource.analyser.frequencies().length - 1
  MAX_POWER_RATIO = MAX_POWER / 100

 */

// if analyser.frequencies().length === 1024 && AnalyserNode.maxDecibels === 255
const MAX_POWER_RATIO = 765.5 / 100;

export default class AudioReactive {

  constructor() {
    // this._minPower = 5;

    this._startTime = null;
    this._pauseTime = null;

    this._isPlaying = false;
    this._destroyed = false;

    this._soundSource = null;

    this._name = 'AudioReactive';
    this._audio = 'John Newman - Love Me Again';

    // Song Range: 510.5 --> 621.5
    // Theorical General Range: (0 ~ 20) --> (800 ~ 20.000) --> (1024 ~ 25.600)
  }

  init(element) {
    if (!Detector.webgl) {
      return false;
    }

    this._element = element;
    this._context = element.getContext('2d');
    this._context.fillStyle = '#FFFFFF';

    return true;
  }

  startExperience() {
    this._experienceStarted = true;
    this._initAudio();
  }

  _initAudio() {
    this._soundSource = document.createElement('audio');

    this._soundSource.autoplay = false;
    this._soundSource.src = 'assets/' + this._audio + '.mp3';
    this._soundSource.addEventListener('ended', this._onAudioTrackEnded.bind(this));

    this._soundSource.addEventListener('canplay', () => {
      this._soundSource.loaded = true;
      this._soundSource.volume = 1.0;
      this._playAudioTrack();
    });
  }

  _playAudioTrack() {
    this._startTime = Date.now();
    this._soundSource.analyser = analyser(this._soundSource);

    this._soundSource.play();
    this._isPlaying = true;

    // TweenLite.to(this._startExperienceButton, 0.5, {opacity: 1, display: 'block'});
    requestAnimationFrame(this._render.bind(this));
  }

  _onAudioTrackEnded() {

  }

  _getAnalysedValue() {
    let freq = this._soundSource.analyser.frequencies();
    let sum = 0;

    for (let i = 0; i < freq.length; i++) {
      sum += freq[i] + i;
    }

    // Force to min value as this._minPower:
    // sum = Math.max(this._minPower, sum);

    sum = sum / freq.length - 1;
    return sum / MAX_POWER_RATIO;
  }

  _drawAudioAnalysis(value) {
    let h = this._height / 100 * value;
    let x = this._width / 2 - 100;
    let y = this._height - h;

    this._context.fillRect(x, y, 100, h);
  }

  _render() {
    if (this._destroyed) {
      return;
    }

    this._drawAudioAnalysis(this._getAnalysedValue());
    requestAnimationFrame(this._render.bind(this));

    // let frequency = 0;
    // let bassFreq = 0;
    // let vocalsFreq = 0;

    // if (this._isPlaying) {
      // frequency = this._getAnalysedValue();
      // bassFreq = this._getAverageValue(this._soundSources.bass);
      // vocalsFreq = this._getAverageValue(this._soundSources.vocals);
    // }
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

  resize(w, h) {
    this._width = w || this._element.width;
    this._height = h || this._element.height;
  }

  destroy() {
    this._destroyed = true;
  }
}
