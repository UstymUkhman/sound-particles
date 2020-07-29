import { vec3, mat4, quat } from 'gl-matrix';

const UP = vec3.fromValues(0, 1, 0);

export default class CameraControls {
  constructor (mViewMatrix, mRadius = 5, mListenerTarget = window) {
    this.listenerTarget = mListenerTarget;
    this.mat4Target = mViewMatrix;
    this.targetRadius = mRadius;
    this.center = vec3.create();

    this.mouseDown = { x: 0, y: 0 };
    this.rotationSenstivity = 1.0;
    this.mouse = { x: 0, y: 0 };

    this.quat = quat.create();
    this.vec3 = vec3.create();
    this.mat4 = mat4.create();

    this.addEventListeners();
    this.zoomLocked = false;
    this.locked = false;
    this.down = false;

    this.radius = mRadius;
    this.senstivity = 1;
    this.easing = 0.1;

    this.prevX = 0;
    this.prevY = 0;

    this.trX = 0;
    this.trY = 0;

    this.rX = 0;
    this.rY = 0;
  }

  addEventListeners () {
    this.listenerTarget.addEventListener('DOMMouseScroll', event => this.onWheel(event));
    this.listenerTarget.addEventListener('mousewheel', event => this.onWheel(event));

    this.listenerTarget.addEventListener('touchstart', event => this.onDown(event));
    this.listenerTarget.addEventListener('touchmove', event => this.onMove(event));
    this.listenerTarget.addEventListener('touchend', event => this.onUp(event));

    this.listenerTarget.addEventListener('mousedown', event => this.onDown(event));
    this.listenerTarget.addEventListener('mousemove', event => this.onMove(event));
    this.listenerTarget.addEventListener('mouseup', event => this.onUp(event));
  }

  onWheel (event) {
    if (this.zoomLocked) return;

    const w = event.wheelDelta;
    const d = event.detail;

    const value = !d ? w / 120 :
      w ? (w / d / 40 * d > 0 ? 1 : -1) : -d / 3;

    this.targetRadius += (-value * 2 * this.senstivity);

    if (this.targetRadius < 0.01) {
      this.targetRadius = 0.01;
    }
  }

  onDown (event) {
    if (this.locked) return;

    this.mouseDown = this.getCursorPos(event);
    this.mouse = this.getCursorPos(event);

    this.prevX = this.trX = this.rX;
    this.prevY = this.trY = this.rY;

    this.down = true;
  }

  onMove (event) {
    if (this.locked || !this.down) return;
    this.mouse = this.getCursorPos(event);
  }

  onUp (event) {
    if (this.locked) return;
    this.down = false;
  }

  update () {
    const senstivity = 0.02 * this.rotationSenstivity;

    const dx = this.mouse.x - this.mouseDown.x;
    const dy = this.mouse.y - this.mouseDown.y;

    this.trY = this.prevY - dx * senstivity;
    this.trX = this.prevX - dy * senstivity;

    if (this.trX < -Math.PI / 2 + 0.01) {
      this.trX = -Math.PI / 2 + 0.01;
    } else if (this.trX > Math.PI / 2 - 0.01) {
      this.trX = Math.PI / 2 - 0.01;
    }

    this.radius += (this.targetRadius - this.radius) * this.easing;

    this.rX += (this.trX - this.rX) * this.easing;
    this.rY += (this.trY - this.rY) * this.easing;

    quat.identity(this.quat);
    quat.rotateY(this.quat, this.quat, this.rY);
    quat.rotateX(this.quat, this.quat, this.rX);

    vec3.set(this.vec3, 0, 0, this.radius);
    vec3.transformQuat(this.vec3, this.vec3, this.quat);

    mat4.identity(this.mat4);
    mat4.lookAt(this.mat4, this.vec3, this.center, UP);

    if (this.mat4Target) mat4.copy(this.mat4Target, this.mat4);
  }

  getCursorPos (event) {
    return event.touches ? {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY
    } : {
      x: event.clientX,
      y: event.clientY
    };
  }

  lockZoom (locked) {
    this.zoomLocked = locked;
  }

  lock (locked) {
    this.locked = locked;
  }
}
