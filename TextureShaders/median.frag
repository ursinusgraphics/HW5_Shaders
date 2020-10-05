precision mediump float;

const float BLUR_SUPPORT = 0.01;
const float BLUR_INC = 0.001;

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
    float numTotal = 0.0;
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    for (float dx = -BLUR_SUPPORT; dx <= BLUR_SUPPORT; dx += BLUR_INC) {
        for (float dy = -BLUR_SUPPORT; dy <= BLUR_SUPPORT; dy += BLUR_INC) {
            vec2 I = texture2D(uSampler, vec2(x+dx, y+dy));
            // TODO: Fill this in (CLASS EXERCISE)
            numTotal++;
        }
    }
    gl_FragColor /= numTotal;
    gl_FragColor[3] = 1.0;
}
