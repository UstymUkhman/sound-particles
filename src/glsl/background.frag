precision highp float;

uniform float progress;
uniform float aspect;
uniform bool dark;

varying vec2 vUv;

vec3 blend(vec3 base, vec3 blend) {
  return mix(
    1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
    2.0 * base * blend,
    step(base, vec3(0.5))
  );
}

float random (vec2 co) {
  float a = 12.9898;
  float b = 78.233;
  float c = 43758.5453;

  float dt = dot(co.xy ,vec2(a, b));
  return fract(sin(mod(dt, 3.14)) * c);
}

void main (void) {
  const vec3 white = vec3(0.8, 0.8, 0.8);
  const vec3 black = vec3(0.0, 0.0, 0.0);

  vec2 smoothing = vec2(-0.4, 0.8);
  vec2 offset = vec2(0.0, 0.0);
  vec2 scale = vec2(1.0, 1.0);
  vec2 pos = vUv;

  pos   -= 0.5;
  pos.x *= aspect;
  pos   /= scale;
  pos   -= offset;

  float dist = length(pos);
  float prog = 0.0;

  if (progress > 5.3)
    if (!dark) prog = 0.75;
    else prog = (progress - 5.3) / 100.0 + 0.1;

  vec3 centerColor = prog * white;
  vec4 color = vec4(1.0);

  dist = smoothstep(smoothing.x, smoothing.y, 1.0 - dist);
  color.rgb = mix(black, centerColor, dist);

  vec3 noise = vec3(random(vUv * 1.5), random(vUv * 2.5), random(vUv));
  color.rgb = mix(color.rgb, blend(color.rgb, noise), 0.1);

  gl_FragColor = color;
}
