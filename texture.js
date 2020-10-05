// Code copied from 
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}


/**
 * A class for storing the shader program and buffers for rendering
 * a texture mapped square
 */
class TextureShader extends ShaderProgram {
    constructor(imagePath) {
        super();
        this.scale = 1;
        this.centervec = glMatrix.vec2.fromValues(0, 0);
        this.imagePath = imagePath;
        this.texture = this.glcanvas.gl.createTexture();
        this.loadTexture(this.imagePath);
        this.setupMenu();
    }

    /**
     * Initialize a texture and load an image.
     * When the image finished loading copy it into the texture.
     *
     * @param {String} url path to texture
     */
    loadTexture(url) {
        let gl = this.glcanvas.gl;
        let texture = this.texture;
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
        let shaderObj = this;
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
            shaderObj.render.bind(shaderObj)();
        };
        image.src = url;
    }

    clickerDragged(evt) {
        this.clickerDraggedCenterScale(evt);
    }

    updateImage() {
        this.loadTexture(this.imagePath);
        this.render();
    }

    setupMenu() {
        let shaderObj = this;
        let menu = new dat.GUI();
        this.menu = menu;
        menu.add(this, 'imagePath');
        menu.add(this, 'updateImage');
        this.shaderType = 'basic';
        menu.add(this, 'shaderType', ['basic', 'grayscale', 'mean', 'median', 'laplacian', 'emboss', 'invert', 'rotateanim', 'translateanim', 'wigglyanim', 'blackholeanim']).onChange(
            function(type) {
                shaderObj.loadShader("TextureShaders/"+type);
            }
        );
    }

    /**
     * Asynchronously load the vertex and fragment shaders
     * @param {*} name 
     */
    loadShader(name) {
        if (name === undefined) {
            name = "TextureShaders/basic";
        }
        let gl = this.glcanvas.gl;
        let textureShader = getShaderProgramAsync(gl, name);
        let shaderObj = this;
        textureShader.then(function(shader) {
            // Extract uniforms and store them in the shader object
            shader.uSampler = gl.getUniformLocation(shader, 'uSampler');
            shader.uTimeUniform = gl.getUniformLocation(shader, "uTime");
            shader.uCenterUniform = gl.getUniformLocation(shader, "uCenter");
            shader.uScaleUniform = gl.getUniformLocation(shader, "uScale");
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
        this.thisTime = (new Date()).getTime();
        this.lastTime = this.thisTime;
        this.setupMouseHandlers();
        this.render();
    }

    /**
     * Draw using WebGL
     * @param {boolean} loop Whether to have an animation loop
     */
    render(loop) {
        if (loop === undefined) {
            loop = true;
        }
        let gl = this.glcanvas.gl;
        let shader = this.shader;
        if (shader === undefined) {
            return;
        }
        gl.useProgram(shader);

        // Step 1: Setup uniform variables that are sent to the shaders
        this.thisTime = (new Date()).getTime();
        this.time += (this.thisTime - this.lastTime)/1000.0;
        this.lastTime = this.thisTime;
        gl.uniform1f(shader.uTimeUniform, this.time);
        gl.uniform2fv(shader.uCenterUniform, this.centervec);
        gl.uniform1f(shader.uScaleUniform, this.scale);

        // Step 2: Bind vertex and index buffers to draw two triangles
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        // Step 3: Set active texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shader.uSampler, 0);

        if (loop && !(shader.uTimeUniform === null)) {
            // Keep the animation loop going
            requestAnimationFrame(this.render.bind(this));
        }
    }
    
}



class BilateralShader extends TextureShader {
    constructor(imagePath) {
        super(imagePath);
    }

    /**
     * Asynchronously load the vertex and fragment shaders
     * @param {*} name 
     */
    loadShader() {
        let gl = this.glcanvas.gl;
        let textureShader = getShaderProgramAsync(gl, "TextureShaders/bilateral");
        let shaderObj = this;
        textureShader.then(function(shader) {
            // Extract uniforms and store them in the shader object
            shader.uSampler = gl.getUniformLocation(shader, 'uSampler');
            shader.uTimeUniform = gl.getUniformLocation(shader, "uTime");
            shader.uCenterUniform = gl.getUniformLocation(shader, "uCenter");
            shader.uScaleUniform = gl.getUniformLocation(shader, "uScale");
            shader.uSigmadUniform = gl.getUniformLocation(shader, "uSigmad");
            shader.uSigmarUniform = gl.getUniformLocation(shader, "uSigmar");
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

    setupMenu() {
        let shaderObj = this;
        let menu = new dat.GUI();
        this.menu = menu;
        menu.add(this, 'imagePath');
        menu.add(this, 'updateImage');
        this.sigmad = 0.01;
        this.sigmar = 0.01;
        menu.add(this, "sigmad", 0, 0.2).onChange(
            function(sigma) {
                shaderObj.sigmad = sigma;
                shaderObj.render.bind(shaderObj)();
            }
        )
        menu.add(this, "sigmar", 0, 0.2).onChange(
            function(sigma) {
                shaderObj.sigmar = sigma;
                shaderObj.render.bind(shaderObj)();
            }
        )
    }

    render() {
        let gl = this.glcanvas.gl;
        let shader = this.shader;
        if (shader === undefined) {
            return;
        }
        gl.useProgram(shader);
        gl.uniform1f(shader.uSigmadUniform, this.sigmad);
        gl.uniform1f(shader.uSigmarUniform, this.sigmar);
        super.render(false);
    }
}