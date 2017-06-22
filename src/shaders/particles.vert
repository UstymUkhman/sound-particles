precision highp float;

attribute vec3 startPosition;
attribute vec3 endPosition;
attribute float index;

uniform float frequencies[1024];
// uniform float time;

uniform mat4 proj;
uniform mat4 view;

varying vec4 vColor;

void main(void) {
  int i = int(index);
  float frequency = frequencies[i];

  vec3 dist = (endPosition - startPosition) * frequency;
  vec3 pos = startPosition + dist;

  float alpha = 0.0 + frequency * 3.0;
  const float dark = 0.3;

  vec3 color = vec3(
    dark - startPosition.x,
    dark - startPosition.y,
    dark - startPosition.z
  );

  gl_Position = proj * view * vec4(pos, 1.0);
  gl_PointSize = 25.0 * frequency + 8.0;
  vColor = vec4(color, alpha);
}
