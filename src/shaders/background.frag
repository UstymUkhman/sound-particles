precision highp float;

uniform float progress;
uniform float aspect;
uniform bool dark;

varying vec2 vUv;

void main() {
  const vec3 white = vec3(1.0, 1.0, 1.0);
  const vec3 black = vec3(0.0, 0.0, 0.0);

  vec2 smoothing = vec2(-0.4, 0.8);
  vec2 scale = vec2(1.0, 1.0);
  vec2 offset = vec2(0.0, 0.0);
  vec2 pos = vUv;

  pos -= 0.5;
  pos.x *= aspect;
  pos /= scale;
  pos -= offset;

  float prog = progress / 100.0;
  float dist = length(pos);

  if (dark) {
    prog += 0.05;
  } else {
    prog = 0.75;
  }

  vec3 centerColor = prog * white;
  vec4 color = vec4(1.0);

  dist = smoothstep(smoothing.x, smoothing.y, 1.0 - dist);
  color.rgb = mix(black, centerColor, dist);

  gl_FragColor = color;
}
