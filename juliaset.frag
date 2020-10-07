precision highp float;

// The maximum number of iterations before escape should be
// included here (You can change this)
#define MAX_ITERS 100.0

// Uniforms set from Javascript that are constant
// over all fragments
uniform vec2 uCenter; // Where the origin (0, 0) is on the canvas
uniform vec2 uC; // z -> z^2 + uC
uniform float uScale; // Scale of fractal
uniform float uEscape; // Escape distance
uniform vec3 uPows; /* Final color will be R = uPows.x^(-count/MAX_ITERS)
                    *                      G = uPows.y^(-count/MAX_ITERS)
                    *                      B = uPows.z^(-count/MAX_ITERS) */

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

void main() {
    //TODO: Fill this in
    vec2 z = uScale*v_position - uCenter;
    float count = 0.0;
    float x, y;
    for (float i = 0.0; i < MAX_ITERS; i += 1.0) {
        x = z.x*z.x - z.y*z.y + uC.x;
        y = 2.0*z.x*z.y + uC.y;
        if (dot(z, z) > uEscape*uEscape) {
            count = i;
            break;
        }
        z.x = x;
        z.y = y;
    }
    gl_FragColor = vec4(pow(uPows.x, -count/MAX_ITERS), pow(uPows.y, -count/MAX_ITERS), pow(uPows.z, -count/MAX_ITERS), 1);
}
