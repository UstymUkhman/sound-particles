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
  /* Pulse
   *
    vec3 offset = (endPosition - startPosition) * fract(time);
    vec3 pos;

    if (direction == 1.0) {
      pos = startPosition + offset;
    } else {
      pos = endPosition - offset;
    }
   */

  int i = int(index);
  const float frequency = frequencies[i];

  vec3 dist = (endPosition - startPosition) * frequency;
  vec3 pos = startPosition + dist;
  const float dark = 0.5;

  gl_Position = proj * view * vec4(pos, 1.0);
  gl_PointSize = 25.0 * frequency + 5.0; // 8.0
  
  vec3 color = vec3(
    dark - startPosition.x,
    dark - startPosition.y,
    dark - startPosition.z
  );

  vColor = vec4(color, 1.0);
}
