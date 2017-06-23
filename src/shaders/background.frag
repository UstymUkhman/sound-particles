precision highp float;

uniform vec3 color1;
uniform vec3 color2;

uniform float aspect;

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

  float dist = length(pos);
  vec4 color = vec4(1.0);

  dist = smoothstep(smoothing.x, smoothing.y, 1.0 - dist);
  color.rgb = mix(color2, color1, dist);

  gl_FragColor = color;
}
