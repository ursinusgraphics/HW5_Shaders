precision mediump float;

const float BLUR_SUPPORT = 0.05;
const float BLUR_INC = 0.005;

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;
// The 2D texture coordinate in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying highp vec2 v_texture;

uniform sampler2D uSampler;

uniform float uSigmar;
uniform float uSigmad;

/**
 * Compute the intensity of a color pixel
 * @param rgba The red, green, blue, alpha describing the pixel
 */
float getIntensity(vec4 rgba) {
    return 0.2125*rgba[0] + 0.7154*rgba[1] + 0.0721*rgba[2];
}

void main() {
    float x1 = v_texture.x;
    float y1 = v_texture.y;
    vec4 I1 = texture2D(uSampler, vec2(x1, y1));
    gl_FragColor = I1; // TODO: This is a placeholder
    for (float dx = -BLUR_SUPPORT; dx <= BLUR_SUPPORT; dx += BLUR_INC) {
        for (float dy = -BLUR_SUPPORT; dy <= BLUR_SUPPORT; dy += BLUR_INC) {
            float x2 = x1 + dx;
            float y2 = y1 + dy;
            // TODO: Fill this in to implement a bilateral filter
            
        }
    }
    gl_FragColor[3] = 1.0;
}
