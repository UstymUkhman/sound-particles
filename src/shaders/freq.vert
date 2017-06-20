precision highp float;

attribute vec3 vertexPositions;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main(void) {
  gl_Position = vec4(vertexPositions, 1.0);
  vTextureCoord = aTextureCoord;
}
