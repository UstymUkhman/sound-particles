(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("AudioReactive", [], factory);
	else if(typeof exports === 'object')
		exports["AudioReactive"] = factory();
	else
		root["AudioReactive"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var Detector = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () {

		try {

			var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );

		} catch ( e ) {

			return false;

		}

	} )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' );

		}

		return element;

	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};

// browserify support
if ( true ) {

	module.exports = Detector;

}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};"object"===typeof module&&(module.exports=Stats);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var AudioContext = window.AudioContext || window.webkitAudioContext

module.exports = WebAudioAnalyser

function WebAudioAnalyser(audio, ctx, opts) {
  if (!(this instanceof WebAudioAnalyser)) return new WebAudioAnalyser(audio, ctx, opts)
  if (!(ctx instanceof AudioContext)) (opts = ctx), (ctx = null)

  opts = opts || {}
  this.ctx = ctx = ctx || new AudioContext

  if (!(audio instanceof AudioNode)) {
    audio = (audio instanceof Audio || audio instanceof HTMLAudioElement)
      ? ctx.createMediaElementSource(audio)
      : ctx.createMediaStreamSource(audio)
  }

  this.analyser = ctx.createAnalyser()
  this.stereo   = !!opts.stereo
  this.audible  = opts.audible !== false
  this.wavedata = null
  this.freqdata = null
  this.splitter = null
  this.merger   = null
  this.source   = audio

  if (!this.stereo) {
    this.output = this.source
    this.source.connect(this.analyser)
    if (this.audible)
      this.analyser.connect(ctx.destination)
  } else {
    this.analyser = [this.analyser]
    this.analyser.push(ctx.createAnalyser())

    this.splitter = ctx.createChannelSplitter(2)
    this.merger   = ctx.createChannelMerger(2)
    this.output   = this.merger

    this.source.connect(this.splitter)

    for (var i = 0; i < 2; i++) {
      this.splitter.connect(this.analyser[i], i, 0)
      this.analyser[i].connect(this.merger, 0, i)
    }

    if (this.audible)
      this.merger.connect(ctx.destination)
  }
}

WebAudioAnalyser.prototype.waveform = function(output, channel) {
  if (!output) output = this.wavedata || (
    this.wavedata = new Uint8Array((this.analyser[0] || this.analyser).frequencyBinCount)
  )

  var analyser = this.stereo
    ? this.analyser[channel || 0]
    : this.analyser

  analyser.getByteTimeDomainData(output)

  return output
}

WebAudioAnalyser.prototype.frequencies = function(output, channel) {
  if (!output) output = this.freqdata || (
    this.freqdata = new Uint8Array((this.analyser[0] || this.analyser).frequencyBinCount)
  )

  var analyser = this.stereo
    ? this.analyser[channel || 0]
    : this.analyser

  analyser.getByteFrequencyData(output)

  return output
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Detector = __webpack_require__(0);

var _Detector2 = _interopRequireDefault(_Detector);

var _stats = __webpack_require__(1);

var _stats2 = _interopRequireDefault(_stats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import { TweenLite } from 'gsap';

var analyser = __webpack_require__(2);
var MAX_DECIBELS = 255;

//                             i   Hz        i      Hz          i       Hz
// Theorical Frequency Range: (0 ~ 20) --> (800 ~ 20.000) --> (1024 ~ 25.600)

var AudioReactive = function () {
  function AudioReactive() {
    _classCallCheck(this, AudioReactive);

    this._startTime = null;
    this._pauseTime = null;

    this._isPlaying = false;
    this._destroyed = false;

    this._soundSource = null;

    this._name = 'AudioReactive';
    this._audio = 'John Newman - Love Me Again';
  }

  _createClass(AudioReactive, [{
    key: 'init',
    value: function init(element) {
      if (!_Detector2.default.webgl) {
        return false;
      }

      this._element = element;
      this._context = this._element.getContext('2d');

      return true;
    }
  }, {
    key: 'startExperience',
    value: function startExperience() {
      var study = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var AudioContext = window.AudioContext || window.webkitAudioContext;
      var audioContext = new AudioContext();
      var audioContextAnalyser = audioContext.createAnalyser();

      this._frequencyRange = audioContextAnalyser.frequencyBinCount;

      this._getMaxAudioPower();
      this._experienceStarted = true;

      if (study) {
        this._getAudioValues();
      } else {
        this._loadAudioTrack();
      }
    }
  }, {
    key: '_getAudioValues',
    value: function _getAudioValues() {
      this._maxFrequency = 0;
      this._minFrequency = Infinity;

      this._studingAudio = true;
      this._loadAudioTrack(true);
    }
  }, {
    key: '_loadAudioTrack',
    value: function _loadAudioTrack() {
      var _this = this;

      var study = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var onAudioEnded = study ? this._setAudioValues.bind(this) : this._onAudioTrackEnded.bind(this);

      if (this._soundSource === null) {
        this._soundSource = document.createElement('audio');
      }

      this._soundSource.autoplay = false;
      this._soundSource.src = 'assets/' + this._audio + '.mp3';
      this._soundSource.addEventListener('ended', onAudioEnded);

      this._soundSource.addEventListener('canplay', function () {
        _this._soundSource.loaded = true;
        _this._soundSource.volume = 1.0;

        if (!study) {
          _this.MAX_POWER = 7.655;
          _this.SONG_MIN_POWER = 510.5 / _this.MAX_POWER;
          _this.SONG_MAX_POWER = 621.5 / _this.MAX_POWER;
          _this.SONG_RANGE = _this.SONG_MAX_POWER - _this.SONG_MIN_POWER;

          _this._playAudioTrack();
        } else {
          _this._soundSource.analyser = analyser(_this._soundSource);
          _this._soundSource.play();

          requestAnimationFrame(_this._studyAudio.bind(_this));
        }
      });
    }
  }, {
    key: '_studyAudio',
    value: function _studyAudio() {
      if (!this._studingAudio) {
        return;
      }

      var frequency = this._getAnalyserFrequencies();

      if (this._maxFrequency < frequency) {
        this._maxFrequency = frequency;
      }

      if (this._minFrequency > frequency) {
        this._minFrequency = frequency;
      }

      requestAnimationFrame(this._studyAudio.bind(this));
    }
  }, {
    key: '_playAudioTrack',
    value: function _playAudioTrack() {
      this._startTime = Date.now();
      this._soundSource.analyser = analyser(this._soundSource);

      this._soundSource.play();
      this._isPlaying = true;

      requestAnimationFrame(this._render.bind(this));
    }
  }, {
    key: '_onAudioTrackEnded',
    value: function _onAudioTrackEnded() {}
  }, {
    key: '_getAnalysedValue',
    value: function _getAnalysedValue() {
      return this._getAnalyserFrequencies() / this.MAX_POWER;
    }
  }, {
    key: '_getAnalyserFrequencies',
    value: function _getAnalyserFrequencies() {
      var freq = this._soundSource.analyser.frequencies();
      var sum = 0;

      for (var i = 0; i < freq.length; i++) {
        sum += freq[i] + i;
      }

      sum = sum / freq.length - 1;
      return sum;
    }
  }, {
    key: '_drawAudioAnalysis',
    value: function _drawAudioAnalysis(value) {
      value -= this.SONG_MIN_POWER;
      value = value * 100 / this.SONG_RANGE;
      this._context.clearRect(0, 0, this._width, this._height);

      var h = this._height / 100 * value;
      var x = this._width / 2 - 50;
      var y = this._height - h;

      this._context.fillStyle = '#FFFFFF';
      this._context.fillRect(x, y, 100, h);
    }
  }, {
    key: '_render',
    value: function _render() {
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
  }, {
    key: '_getMaxAudioPower',
    value: function _getMaxAudioPower() {
      var max = 0;

      for (var i = 0; i < this._frequencyRange; i++) {
        max += MAX_DECIBELS + i;
      }

      this.MAX_POWER = (max / this._frequencyRange - 1) / 100;
      console.log('Max audio power = ' + this.MAX_POWER);
    }
  }, {
    key: '_setAudioValues',
    value: function _setAudioValues() {
      this.SONG_MIN_POWER = this._minFrequency / this.MAX_POWER;
      this.SONG_MAX_POWER = this._maxFrequency / this.MAX_POWER;
      this.SONG_RANGE = this.SONG_MAX_POWER - this.SONG_MIN_POWER;

      console.log('Song min frequency = ' + this._minFrequency);
      console.log('Song max frequency = ' + this._maxFrequency);
      console.log('Song frequency range = ' + this.SONG_RANGE);

      this._studingAudio = false;
      this._loadAudioTrack();
    }
  }, {
    key: 'showStats',
    value: function showStats() {
      if (!this.stats) {
        this.stats = new _stats2.default();
      }

      document.body.appendChild(this.stats.dom);
    }
  }, {
    key: 'hideStats',
    value: function hideStats() {
      this.stats.dom.parentNode.removeChild(this.stats.dom);
    }
  }, {
    key: 'resize',
    value: function resize(width, height) {
      this._width = width;
      this._height = height;

      this._element.width = this._width;
      this._element.height = this._height;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this._destroyed = true;
    }
  }]);

  return AudioReactive;
}();

exports.default = AudioReactive;
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=AudioReactive.js.map