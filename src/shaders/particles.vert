precision highp float;

attribute vec2 aTextureCoord;
attribute vec3 startPosition;
attribute vec3 endPosition;
attribute float index;

uniform float frequencies[1024];
uniform sampler2D texture;
// uniform float time;
uniform float direction;
uniform mat4 proj;
uniform mat4 view;

varying vec4 vColor;

void main(void) {
  // vec3 pos = startPosition;
  // vec3 offset = endPosition * fract(time);
  // vec3 pos = startPosition + offset;

  // float timeDec = time - fract(time);
  // float timeMod = mod(timeDec, 2.0);

  // if (timeMod == 1.0) {
  //   pos = endPosition - offset;
  // }

  int i = int(index);
  float frequency = frequencies[i];

  vec3 dist = (endPosition - startPosition) * frequency;
  vec3 pos = startPosition + dist;

  gl_Position = proj * view * vec4(pos, 1.0);
  gl_PointSize = 8.0; // could be randomized

  vec3 color = texture2D(texture, aTextureCoord).rgb;
  vColor = vec4(color, 1.0);
}
