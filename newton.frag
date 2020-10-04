precision highp float;

// The maximum number of iterations before escape should be
// included here (You can change this)
#define MAX_ITERS 100.0
#define MAX_DEGREE 10

// Uniforms set from Javascript that are constant
// over all fragments
uniform vec2 uCenter; // Where the origin (0, 0) is on the canvas
uniform float uScale; // Scale of fractal
uniform float uCoeffs[MAX_DEGREE+1]; // Coefficients of polynomial

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

void main() {
    vec2 z = uScale*v_position - uCenter; // Initial starting point
    //TODO: Fill this in
    float total;
    for (int i = 0; i <= MAX_DEGREE; i++) {
        total += uCoeffs[i];
    }
    gl_FragColor = vec4(z[0], z[1], total, 1.0);
}
