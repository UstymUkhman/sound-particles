precision highp float;

attribute vec2 aTextureCoord;
attribute vec3 positions;

uniform mat4 view;
uniform mat4 proj;

uniform sampler2D texture;

varying vec3 vColor;

void main(void) {
  gl_Position = proj * view * vec4(positions, 1.0);
  gl_PointSize = 8.0; // could be randomized

  vColor = texture2D(texture, aTextureCoord).rgb;
}
