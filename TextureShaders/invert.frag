precision mediump float;

const float BLUR_WIDTH = 5.0;
const float GRAY_TIME = 2.0;

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;
// The 2D texture coordinate in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying highp vec2 v_texture;

uniform sampler2D uSampler;

void main() {
    float x = v_texture.x;
    float y = v_texture.y;

    vec4 rgba = texture2D(uSampler, vec2(x, y));
    // TODO: Invert the colors so that red = 1-red, green = 1-green, blue = 1-blue
    gl_FragColor = rgba;
}
