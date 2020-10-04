precision mediump float;

const float BLUR_WIDTH = 5.0; // Make this larger for blurrier images

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
    float diff = 0.005;
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    for (float i = -BLUR_WIDTH/2.0; i < BLUR_WIDTH/2.0; i++) {
        for (float j = -BLUR_WIDTH/2.0; j < BLUR_WIDTH/2.0; j++) {
            gl_FragColor += texture2D(uSampler, vec2(x+i*diff, y+j*diff));
        }
    }
    gl_FragColor /= (BLUR_WIDTH*BLUR_WIDTH);
    gl_FragColor[3] = 1.0;
}
