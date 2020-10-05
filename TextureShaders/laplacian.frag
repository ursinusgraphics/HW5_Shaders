precision mediump float;

const float BLUR_WIDTH = 5.0; // Make this larger for blurrier images

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
    float diff = 0.005;
    gl_FragColor = 4.0*texture2D(uSampler, vec2(x, y));
    for (float i = -1.0; i <= 1.0; i += 2.0) {
        for (float j = -1.0; j <= 1.0; j += 2.0) {
            gl_FragColor -= texture2D(uSampler, vec2(x+i*diff, y+j*diff));
        }
    }
    gl_FragColor[3] = 1.0;
}
