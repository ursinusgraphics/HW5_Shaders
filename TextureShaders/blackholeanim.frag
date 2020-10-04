precision mediump float;

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;
// The 2D texture coordinate in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying highp vec2 v_texture;

uniform sampler2D uSampler;

uniform float uTime;

void main() {
    float c = cos(uTime);
    float s = sin(uTime);
    float x = v_texture.x;
    float y = v_texture.y;

    // Center of black hole
    float cx = 0.7; 
    float cy = 0.5;

    x = v_texture.x - cx;
    y = v_texture.y - cy;
    float theta = atan(y, x);
    float r = sqrt(x*x+y*y);
    x = cx + (r + 0.1*cos(uTime))*cos(theta);
    y = cy + (r + 0.1*cos(uTime))*sin(theta);
    if (x > 1.0 || x < 0.0 || y > 1.0 || y < 0.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
    else {
        vec2 tex = vec2(x, y);
        gl_FragColor = texture2D(uSampler, tex);
    }
}
