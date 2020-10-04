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

uniform float uTime;

void main() {
    float x = v_texture.x;
    float y = v_texture.y;

    // Use 0.2125R + 0.7154G + 0.0721B to convert to grayscale
    vec4 rgba = texture2D(uSampler, vec2(x, y));
    float gray = 0.2125*rgba[0] + 0.7154*rgba[1] + 0.0721*rgba[2];
    vec4 grayscale = vec4(gray, gray, gray, 1.0);
    float t = uTime/GRAY_TIME;
    if (t <= 1.0) {
        gl_FragColor = t*grayscale + (1.0-t)*rgba;
    }
    else {
        gl_FragColor = grayscale;
    }
}
