// Code copied from 
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}


/**
 * Initialize a texture and load an image.
 * When the image finished loading copy it into the texture.
 *
 * @param {gl handle} gl WebGL handle
 * @param {String} url path to texture
 */
function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    width, height, border, srcFormat, srcType,
                    pixel);

    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
        } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}

/**
 * A class for storing the shader program and buffers for rendering
 * a texture mapped square
 */
class TextureShader extends ShaderProgram {
    constructor(imagePath) {
        super();
        this.texture = loadTexture(this.glcanvas.gl, imagePath);
    }

    /**
     * Asynchronously load the vertex and fragment shaders
     */
    loadShader() {
        let gl = this.glcanvas.gl;
        let textureShader = getShaderProgramAsync(gl, "texture");
        let shaderObj = this;
        textureShader.then(function(shader) {
            // Extract uniforms and store them in the shader object
            shader.uSampler = gl.getUniformLocation(shader, 'uSampler');
            shader.uTimeUniform = gl.getUniformLocation(shader, "uTime");
            // Extract the position buffer and store it in the shader object
            shader.positionLocation = gl.getAttribLocation(shader, "a_position");
            gl.enableVertexAttribArray(shader.positionLocation);
            // Extract texture coordinate buffer and store it in the shader object
            shader.textureLocation = gl.getAttribLocation(shader, "a_texture");
            gl.enableVertexAttribArray(shader.textureLocation);
            shaderObj.shader = shader;
            shaderObj.setupBuffers();
        });
    }

    setupBuffers() {
        let gl = this.glcanvas.gl;
        let buffers = {};
        // Setup position buffers to hold a square
        buffers.positions = new Float32Array([-1.0,  1.0,
                                            1.0,  1.0,
                                            -1.0, -1.0,
                                            1.0, -1.0]);
        // Setup texture buffer to hold a square
        buffers.textureCoords = new Float32Array([0, 0, 
                                                  1, 0,
                                                  0, 1,
                                                  1, 1]);

        // Setup 2 triangles connecting the vertices so that there
        // are solid shaded regions
        buffers.indices = new Uint16Array([0, 1, 2, 1, 2, 3]);
        
        super.setupBuffers(buffers);

        // Setup animation variables
        this.time = 0.0;
        this.radius = 0.2;
        this.thisTime = (new Date()).getTime();
        this.lastTime = this.thisTime;
        this.render();
    }

    /**
     * Draw using WebGL
     */
    render() {
        let gl = this.glcanvas.gl;
        let shader = this.shader;
        gl.useProgram(shader);

        // Step 1: Setup uniform variables that are sent to the shaders
        this.thisTime = (new Date()).getTime();
        this.time += (this.thisTime - this.lastTime)/1000.0;
        this.lastTime = this.thisTime;
        gl.uniform1f(shader.uTimeUniform, this.time);

        // Step 2: Bind vertex and index buffers to draw two triangles
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        // Step 3: Set active texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shader.uSampler, 0);

        // Keep the animation loop going
        requestAnimationFrame(this.render.bind(this));
    }
    
}



