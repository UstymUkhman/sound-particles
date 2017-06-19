precision highp float;
attribute vec3 vertexPositions;
varying vec3 vColor;

void main() {
  gl_Position = vec4(vertexPositions, 1.0);
}
