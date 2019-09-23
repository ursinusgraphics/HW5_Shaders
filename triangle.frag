precision mediump float;

// The color of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec3 v_color;

void main() {
    gl_FragColor = vec4(v_color, 1.0);
}
