import Detector from 'three/examples/js/Detector';
import Stats from 'three/examples/js/libs/stats.min';

export default class AudioReactive {

  constructor() {
    this._name = 'AudioReactive';
    this._audio = 'John Newman - Love Me Again';
  }

  init(element) {
    if (!Detector.webgl) {
      return false;
    }

    this._element = element;
    this._isPlaying = false;
    this._destroyed = false;

    this._currentScene = 0;

    this._params = {
      wireframe: false,
      bgColor: 'rgb(0,0,0)',
      exposure: 0,
      cameraBaseRotation: 0,
      cameraReactiveRotation: 0,
      blobReactiveness: 0,
      tunnelBaseSpeed: 0,
      tunnelReactiveSpeed: 0,
      tunnelTextureRotateBase: 0,
      tunnelTextureRotateReactive: 0,
      tunnelTextureMix: 0,
      bloomStrength: 0,
      bloomReactiveness: 0,
      bloomThreshold: 0,
      bloomRadius: 0,
      blobColor: 0,
      blobHighlight: 0,
      blobReflectiveness: 0,
      texture1: '',
      texture1b: '',
      texture2: '',
      texture2b: '',
      interactive: false,
      bassCutOff: 0.3,
      vocalsCutOff: 0.3
    };

    this.resize();
    return true;
  }

  startExperience() {
    this._experienceStarted = true;
    this._initAudio();
  }

  _initAudio() {
    this._soundSource = {};
    // this._minimumFrequencyScale = 20;
    // this._frequencyAttenuation = 50;

    this._soundSource = document.createElement('audio');

    this._soundSource.autoplay = false;
    this._soundSource.src = 'assets/' + this._audio + '.mp3';
    this._soundSource.addEventListener('ended', this._onAudioTrackEnded.bind(this));

    this._soundSource.addEventListener('canplay', () => {
      this._soundSource.loaded = true;
      this._soundSource.volume = 1.0;
      this._soundSource.play();
    });
  }

  _onAudioTrackEnded() {

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

  _render() {
    if (this._destroyed) {
      return;
    }
  }

  resize(w, h) {
    this._viewportWidth = w || this._element.width;
    this._viewportHeight = h || this._element.height;

    /* if (this._renderer) {
      this._renderer.setPixelRatio(1);
      this._renderer.setSize(this._viewportWidth, this._viewportHeight);
    }

    if (this._camera) {
      this._camera.aspect = this._viewportWidth / this._viewportHeight;
      this._camera.updateProjectionMatrix();
    }

    if (this._composer && this._renderer) {
      this._composer.setSize(this._viewportWidth, this._viewportHeight);
    } */
  }

  destroy() {
    this._destroyed = true;
  }
}
