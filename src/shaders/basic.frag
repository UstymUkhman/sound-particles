precision highp float;
uniform float color;

void main() {
  float colorValue = float(color) / 100.0;
  gl_FragColor = vec4(colorValue, colorValue, colorValue, 1.0);
}
