precision highp float;

attribute vec2 aTextureCoord;
attribute vec3 positions;
attribute float index;

uniform mat4 view;
uniform mat4 proj;

uniform float frequencies[1024];
uniform sampler2D textureExtra;
uniform sampler2D texture;

// varying float pIndex;
varying vec4 vColor;

void main(void) {
  gl_Position = proj * view * vec4(positions, 1.0);
  gl_PointSize = 8.0; // could be randomized

  vec3 color = texture2D(texture, aTextureCoord).rgb;

  // if (index > 100.0) {
  //   color = vec3(0.0, 0.0, 0.0);
  // }

  int i = int(index);
  float alpha = frequencies[i];
  // vec3 color = vColor;

  // float alpha = frequency;

  // if (frequency == 0.0) {
  //   color = vec3(0.0, 0.0, 0.0);
  // } else {
  //   color = vec3(1.0, 1.0, 1.0);
  // }

  vColor = vec4(vec3(0.0, 0.0, 0.0), alpha); // texture2D(texture, aTextureCoord).rgb;
  // pIndex = index;
}
