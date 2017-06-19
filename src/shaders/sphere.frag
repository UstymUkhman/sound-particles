precision highp float;

varying vec2 vUV;
varying vec3 vNormal;

uniform sampler2D texture;

// float diffuse(vec3 N, vec3 L) {
// 	return max(dot(N, normalize(L)), 0.0);
// }

// vec3 diffuse(vec3 N, vec3 L, vec3 C) {
// 	return diffuse(N, L) * C;
// }

void main(void) {
	gl_FragColor = vec4(0.525, 0.525, 0.525, 1.0);

  // Gradient Texture:
  // vec3 color = texture2D(texture, vUV).rgb;
  // gl_FragColor = vec4(color, 1.0);
}
