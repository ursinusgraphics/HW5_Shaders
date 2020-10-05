precision mediump float;

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;
// The 2D texture coordinate in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying highp vec2 v_texture;

uniform sampler2D uSampler;

uniform float uTime;
uniform vec2 uCenter; // Where the origin (0, 0) is on the canvas
uniform float uScale; // Scale of fractal

void main() {
    vec2 C = uCenter;
    C[1] *= -1.0;
    vec2 pos = uScale*v_texture - C;

    
    //Straight texture map
    gl_FragColor = texture2D(uSampler, pos);
}
