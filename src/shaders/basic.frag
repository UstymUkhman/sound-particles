// basic.frag
precision highp float;

varying vec3 vColor;
uniform vec3 color;
uniform float time;

void main() {
	float offset = sin(time) * 0.5 + 0.5;
	gl_FragColor = vec4(mix(vColor, color, offset), 1.0);

  // gl_FragColor = vec4(vColor, 1.0);
}
