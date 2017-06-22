precision highp float;

attribute vec3 startPosition;
attribute vec3 endPosition;
attribute float index;

uniform float frequencies[1024];
uniform float frequency;
uniform float direction;
uniform float time;

uniform mat4 proj;
uniform mat4 view;

varying vec4 vColor;

void main(void) {
  // Pulse
  // vec3 offset = (endPosition - startPosition) * fract(time);
  // vec3 pos;

  // if (direction == 1.0) {
  //   pos = startPosition + offset;
  // } else {
  //   pos = endPosition - offset;
  // }

  // Audioreactive Particles:
  int i = int(index);
  float frequency = frequencies[i];

  vec3 dist = (endPosition - startPosition) * frequency;
  vec3 pos = startPosition + dist;

  // Audioreactive Sphere:
  // vec3 dist = (endPosition - startPosition) * frequency;
  // vec3 pos = startPosition + dist;

  gl_Position = proj * view * vec4(pos, 1.0);
  gl_PointSize = 25.0 * frequency + 5.0; // 8.0

  float red = startPosition.x;
  float green = startPosition.y;
  float blue = startPosition.z;

  vec3 color = vec3(red, green, blue);

  // if (color.x < 1.0 && color.y < 1.0 && color.z < 1.0) {
  //   color = vec3(1.0 - red, 1.0 - green, blue);
  // }

  vColor = vec4(color, 1.0);
}
