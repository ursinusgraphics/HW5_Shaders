precision highp float;

// The maximum number of iterations before escape should be
// included here (You can change this)
#define MAX_ITERS 100
#define MAX_DEGREE 10

// Uniforms set from Javascript that are constant
// over all fragments
uniform vec2 uCenter; // Where the origin (0, 0) is on the canvas
uniform float uScale; // Scale of fractal
uniform float uColorScale; // Amount by which to scale color
uniform float uCoeffs[MAX_DEGREE+1]; // Coefficients of polynomial

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

/*
 * Raise a complex number z to a power, clamping at MAX_DEGREE
 * @param z Complex number to which to raise to a power
 * @param n Power to which to raise
 */
vec2 pow(vec2 z, int n) {
    vec2 zret = vec2(1.0, 1.0);
    // TODO: Fill this in
    return zret;
}

/*
 * Evaluate the complex polynomial at z, based on 
 * the coefficients in uCoeffs
 * That is, you should have uCoeffs[0] + uCoeffs[1]*z + uCoeffs[2]*z^2 + ...
 * @param z The complex number to evaluate
*/
vec2 polynomial(vec2 z) {
    vec2 ret = vec2(0.0, 0.0);
    // TODO: Fill this in
    return ret;
}

/*
 * Evaluate the derivative complex polynomial at z, based on 
 * the coefficients in uCoeffs, using the power rule
 * That is, you should have uCoeffs[1] + uCoeffs[2]*2z + uCoeffs[3]*3z^2 + ...
 * @param z The complex number to evaluate
*/
vec2 polynomialDeriv(vec2 z) {
    vec2 zret = vec2(0.0, 0.0);
    return zret;
}

/*
 * Perform the complex-number division between two numbers
 * @param z1 The numerator
 * @param z2 The denominator
 */
vec2 complexDiv(vec2 v1, vec2 v2) {
    // TODO: Fill this in
    return vec2(1.0, 1.0); // This is a dummy value
}

void main() {
    vec2 z = uScale*v_position - uCenter; // Initial starting point
    
    // TODO: Fill this in and apply Newton's method in a loop
    // up to MAX_ITERS iterations to iteratively update z,
    // making use of the methods polynomial, polynomialDeriv, and complexDiv

    z = pow(z, 2);


    z = (z + 1.0)/2.0;
    gl_FragColor = vec4(z[0], z[1], 0.5*(z[0]+z[1]), 1.0);
}
