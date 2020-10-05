/**
 * A class for storing the shader program and buffers for rendering
 * circle-related animations
 */
class CircleShader extends ShaderProgram {

    /**
     * Asynchronously load the vertex and fragment shaders
     */
    loadShader() {
        let gl = this.glcanvas.gl;
        let circleShader = getShaderProgramAsync(gl, "circle");
        let shaderObj = this;
        circleShader.then(function(shader) {
            // Extract uniforms and store them in the shader object
            shader.uTimeUniform = gl.getUniformLocation(shader, "uTime");
            shader.uRadiusUniform = gl.getUniformLocation(shader, "uRadius");
            // Extract the position buffer and store it in the shader object
            shader.positionLocation = gl.getAttribLocation(shader, "a_position");
            gl.enableVertexAttribArray(shader.positionLocation);
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
        // We don't need a color buffer since colors will be determined
        // in the shader

        // Setup 2 triangles connecting the vertices so that there
        // are solid shaded regions
        buffers.indices = new Uint16Array([0, 1, 2, 1, 2, 3]);
        
        super.setupBuffers(buffers);

        // Setup animation variables
        this.time = 0.0;
        this.radius = 0.1;
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
        gl.uniform1f(shader.uRadiusUniform, this.radius);

        // Step 2: Bind vertex and index buffers to draw two triangles
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        // Step 3: Keep the animation loop going
        requestAnimationFrame(this.render.bind(this));
    }
    
}


