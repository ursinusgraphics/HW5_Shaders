precision mediump float;

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;
// The 2D texture coordinate in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying highp vec2 v_texture;

uniform sampler2D uSampler;

uniform float uNov; // Related to the amount of spectral change over time
uniform float uRamp; // Roughly correlated to beat tracking up and down
uniform float uActivation; // Roughly correlated to beat clap probability
uniform float uTime; // System time
uniform float uTuneTime; // Time we are in the tune (in seconds)

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
    vec4 I1 = texture2D(uSampler, vec2(x1, y1)); // Texture sampling (you don't have to use this)
    gl_FragColor = I1;
    gl_FragColor[0] = 0.5*(1.0 + cos(uTuneTime)); // TODO: This changes the red channel to the beat.  Please do something more exciting than this
}
