//                             i   Hz        i      Hz          i       Hz
// Theorical Frequency Range: (0 ~ 20) --> (800 ~ 20.000) --> (1024 ~ 25.600)

const analyser = require('web-audio-analyser');
const TOT_FREQUENCIES = 1024; // this._soundSource.analyser.freqdata.length
const MAX_DECIBELS = 255;

export default class AudioReactive {

  constructor(audio) {
    this._startTime = null;
    this._pauseTime = null;

    this._soundSource = null;
    this._isPlaying = false;
    this.isReady = false;

    this._name = 'AudioReactive';
    this._audioSrc = audio;
    this._init();
  }

  _init() {
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioContext = new AudioContext();
    let audioContextAnalyser = audioContext.createAnalyser();

    this._frequencyRange = audioContextAnalyser.frequencyBinCount;
    this._getMaxAudioPower();
  }

  _getMaxAudioPower() {
    let max = 0;

    for (let i = 0; i < this._frequencyRange; i++) {
      max += MAX_DECIBELS + i;
    }

    this.MAX_POWER = (max / this._frequencyRange - 1) / 100;
    console.log(`Max audio power = ${this.MAX_POWER * 100}`);
  }

  _loadAudioTrack(onPlay, study = false) {
    let onAudioEnded = study ? this._setAudioValues.bind(this) : this._onAudioTrackEnded.bind(this);

    if (this._soundSource === null) {
      this._soundSource = document.createElement('audio');
    }

    this._soundSource.autoplay = false;
    this._soundSource.src = this._audioSrc;
    this._soundSource.addEventListener('ended', onAudioEnded);

    this._soundSource.addEventListener('canplay', () => {
      this._soundSource.loaded = true;
      this._soundSource.volume = 1.0;
      this.isReady = true;

      if (!study) {
        this.MAX_POWER = 7.655;
        this.SONG_MIN_POWER = 510.5 / this.MAX_POWER;
        this.SONG_MAX_POWER = 621.5 / this.MAX_POWER;
        this.SONG_RANGE = this.SONG_MAX_POWER - this.SONG_MIN_POWER;

        this._playAudioTrack(onPlay);
      } else {
        this._soundSource.analyser = analyser(this._soundSource);
        this._soundSource.play();

        requestAnimationFrame(this._studyAudio.bind(this));
      }
    });
  }

  _onAudioTrackEnded() {

  }

  _playAudioTrack(onPlay) {
    this._startTime = Date.now();
    this._soundSource.analyser = analyser(this._soundSource);

    this._soundSource.play();
    this._isPlaying = true;

    if (typeof onPlay === 'function') {
      onPlay();
    }
  }

  _studyAudio() {
    if (!this._studingAudio) {
      return;
    }

    let frequency = this._getAverageFrequency();

    if (this._maxFrequency < frequency) {
      this._maxFrequency = frequency;
    }

    if (this._minFrequency > frequency) {
      this._minFrequency = frequency;
    }

    requestAnimationFrame(this._studyAudio.bind(this));
  }

  _getAverageFrequency() {
    let freq = this._soundSource.analyser.frequencies();
    let sum = 0;

    for (let i = 0; i < freq.length; i++) {
      sum += freq[i] + i;
    }

    sum = sum / freq.length - 1;
    return sum;
  }

  _getAnalysedValue() {
    return this._getAverageFrequency() / this.MAX_POWER;
  }

  _setAudioValues() {
    this.SONG_MIN_POWER = this._minFrequency / this.MAX_POWER;
    this.SONG_MAX_POWER = this._maxFrequency / this.MAX_POWER;
    this.SONG_RANGE = this.SONG_MAX_POWER - this.SONG_MIN_POWER;

    console.log(`Song min frequency = ${this._minFrequency}`);
    console.log(`Song max frequency = ${this._maxFrequency}`);
    console.log(`Song frequency range = ${this.SONG_RANGE}`);

    this._studingAudio = false;
    this._loadAudioTrack();
  }

  play(onReady) {
    this._loadAudioTrack(onReady);
    this._study = false;
  }

  getAudioValues() {
    this._study = true;
    this._maxFrequency = 0;
    this._minFrequency = Infinity;

    this._studingAudio = true;
    this._loadAudioTrack(null, true);
  }

  getAverageValue() {
    let value = this._getAnalysedValue();

    value -= this.SONG_MIN_POWER;
    value = value * 100 / this.SONG_RANGE;

    return Math.round(value);
  }

  getFrequencyValues() {
    let frequencies = [];
    let analysed = this._soundSource.analyser.frequencies();

    for (let i = 0; i < analysed.length; i++) {
      frequencies.push(analysed[i] / TOT_FREQUENCIES);
    }

    return frequencies;
  }
}
