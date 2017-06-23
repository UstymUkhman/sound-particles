precision highp float;

uniform float aspect;
uniform float time;

uniform vec3 white;
uniform vec3 black;

varying vec2 vUv;

void main() {
  vec2 smoothing = vec2(-0.4, 0.8);
  vec2 scale = vec2(1.0, 1.0);
  vec2 offset = vec2(0.0, 0.0);
  vec2 pos = vUv;

  pos -= 0.5;
  pos.x *= aspect;
  pos /= scale;
  pos -= offset;

  float progress = time / 100.0;
  float dist = length(pos);

  if (progress > 0.21) {
    progress += 0.4;
  } else if (progress > 0.055) {
    progress += 0.075;
  }

  if (progress > 1.0) {
    progress = 0.75;
  }

  vec3 centerColor = progress * white;
  vec4 color = vec4(1.0);

  dist = smoothstep(smoothing.x, smoothing.y, 1.0 - dist);
  color.rgb = mix(black, centerColor, dist);

  gl_FragColor = color;
}
