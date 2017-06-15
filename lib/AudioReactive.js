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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
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

var analyser = __webpack_require__(3);

/*
  let max = 0

  for (let i = 0; i < soundSource.analyser.frequencies().length; i++) {
    max += (AnalyserNode.maxDecibels + i);
  }

  MAX_POWER = max / soundSource.analyser.frequencies().length - 1
  MAX_POWER_RATIO = MAX_POWER / 100

 */

// if analyser.frequencies().length === 1024 && AnalyserNode.maxDecibels === 255
var MAX_POWER_RATIO = 765.5 / 100;

var AudioReactive = function () {
  function AudioReactive() {
    _classCallCheck(this, AudioReactive);

    // this._minPower = 5;

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
      this._context = element.getContext('2d');
      this._context.fillStyle = '#FFFFFF';

      return true;
    }
  }, {
    key: 'startExperience',
    value: function startExperience() {
      this._experienceStarted = true;
      this._initAudio();
    }
  }, {
    key: '_initAudio',
    value: function _initAudio() {
      var _this = this;

      this._soundSource = document.createElement('audio');

      this._soundSource.autoplay = false;
      this._soundSource.src = 'assets/' + this._audio + '.mp3';
      this._soundSource.addEventListener('ended', this._onAudioTrackEnded.bind(this));

      this._soundSource.addEventListener('canplay', function () {
        _this._soundSource.loaded = true;
        _this._soundSource.volume = 1.0;
        _this._playAudioTrack();
      });
    }
  }, {
    key: '_playAudioTrack',
    value: function _playAudioTrack() {
      this._startTime = Date.now();
      this._soundSource.analyser = analyser(this._soundSource);

      console.log(MAX_POWER_RATIO);

      this._soundSource.play();
      this._isPlaying = true;

      // TweenLite.to(this._startExperienceButton, 0.5, {opacity: 1, display: 'block'});
      // requestAnimationFrame(this._render.bind(this));
    }
  }, {
    key: '_onAudioTrackEnded',
    value: function _onAudioTrackEnded() {}
  }, {
    key: '_getAnalysedValue',
    value: function _getAnalysedValue() {
      var freq = this._soundSource.analyser.frequencies();
      var sum = 0;

      for (var i = 0; i < freq.length; i++) {
        sum += freq[i] + i;
      }

      // Force to min value as this._minPower:
      // sum = Math.max(this._minPower, sum);

      sum = sum / freq.length - 1;
      return sum / this._MAX_POWER_RATIO;
    }
  }, {
    key: '_drawAudioAnalysis',
    value: function _drawAudioAnalysis(value) {
      var h = this._height / 100 * value;
      var x = this._width / 2 - 100;
      var y = this._height - h;

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
    value: function resize(w, h) {
      this._width = w || this._element.width;
      this._height = h || this._element.height;
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

/***/ }),
/* 3 */
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


/***/ })
/******/ ]);
});
//# sourceMappingURL=AudioReactive.js.map