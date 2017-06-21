#extension GL_EXT_draw_buffers : require

precision highp float;

// uniform int frequencies[1024];

// varying float pIndex;
// varying vec3 vColor;
varying vec4 vColor;

void main(void) {
	float d = distance(gl_PointCoord, vec2(0.5));
	if (d > 0.5) discard;

  // int index = int(pIndex);
  // float frequency = float(frequencies[100]);
  // vec3 color = vColor;

  // if (frequency > pIndex) {
  //   color = vec3(0.0, 0.0, 0.0);
  // } else {
  //   color = vec3(1.0, 1.0, 1.0);
  // }

  // gl_FragData[0] = vec4(vec3(1.0, 0.0, 0.0), 1.0);
  // gl_FragData[1] = vec4(vec3(0.0, 1.0, 0.0), 1.0);
  // gl_FragData[2] = vec4(vec3(0.0, 0.0, 1.0), 1.0);

  gl_FragColor = vColor; // vec4(vColor, 1.0);
}
