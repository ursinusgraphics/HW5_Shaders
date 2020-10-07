precision mediump float;

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;
// The 2D texture coordinate in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying highp vec2 v_texture;
uniform float uTime;

uniform sampler2D uSampler;

void main() {
    float x = v_texture.x;
    float y = v_texture.y;
    float diff = 0.01;
    vec4 color = 0.5*texture2D(uSampler, vec2(x-diff*cos(2.5*uTime), y-diff*sin(5.0*uTime))); // Left/up
    color += 0.5*texture2D(uSampler, vec2(x+diff, y+diff));  // Right/down
    gl_FragColor = color;
}
