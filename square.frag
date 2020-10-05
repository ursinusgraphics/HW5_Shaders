precision mediump float;

// PI is not included by default in GLSL
#define M_PI 3.1415926535897932384626433832795

// Uniforms set from Javascript that are constant
// over all fragments
uniform float uTime; // Time elapsed since beginning of simulation
uniform float uHalfSideLen; // Half of the side length

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

void main() {
    //TODO: Fill this in for module 8 exercise 1
    float x = v_position.x;
    float y = v_position.y;
    /* TODO: Change this to a square that moves towards
     * the bottom right with time.  In particular, draw a pixel
     * in red if |x-uTime/5| < uHalfSideLen and |y+uTime/5| < uHalfSideLen.
     * Otherwise, draw it in black
     */
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
