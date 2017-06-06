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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Detector = __webpack_require__(1);

var _Detector2 = _interopRequireDefault(_Detector);

var _stats = __webpack_require__(2);

var _stats2 = _interopRequireDefault(_stats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioReactive = function () {
  function AudioReactive() {
    _classCallCheck(this, AudioReactive);

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

      this._soundSource = {};
      // this._minimumFrequencyScale = 20;
      // this._frequencyAttenuation = 50;

      this._soundSource = document.createElement('audio');

      this._soundSource.autoplay = false;
      this._soundSource.src = 'assets/' + this._audio + '.mp3';
      this._soundSource.addEventListener('ended', this._onAudioTrackEnded.bind(this));

      this._soundSource.addEventListener('canplay', function () {
        _this._soundSource.loaded = true;
        _this._soundSource.volume = 1.0;
        _this._soundSource.play();
      });
    }
  }, {
    key: '_onAudioTrackEnded',
    value: function _onAudioTrackEnded() {}
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
    key: '_render',
    value: function _render() {
      if (this._destroyed) {
        return;
      }
    }
  }, {
    key: 'resize',
    value: function resize(w, h) {
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
/* 1 */
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
/* 2 */
/***/ (function(module, exports) {

// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};"object"===typeof module&&(module.exports=Stats);


/***/ })
/******/ ]);
});
//# sourceMappingURL=AudioReactive.js.map