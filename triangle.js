/**
 * A class for storing the shader program and buffers for rendering
 * a basic triangle
 */
class TriangleShader extends ShaderProgram {

    /**
     * Asynchronously load the vertex and fragment shaders
     */
    loadShader() {
        let gl = this.glcanvas.gl;
        let triShader = getShaderProgramAsync(gl, "triangle");
        let shaderObj = this;
        triShader.then(function(shader) {
            shaderObj.shader = shader;
            // Extract pointers to position and color buffers, and store them
            // in the shader object
            shader.positionLocation = gl.getAttribLocation(shader, "a_position");
            gl.enableVertexAttribArray(shader.positionLocation);
            shader.colorLocation = gl.getAttribLocation(shader, "a_color");
            gl.enableVertexAttribArray(shader.colorLocation);
            shaderObj.setupBuffers();
        });
    }

    /**
     * Setup triangle vertices
     */
    setupBuffers() {
        let buffers = {};
        buffers.positions = new Float32Array([-1.0,  1.0,
                                           1.0,  1.0,
                                          -1.0, -1.0]);
        buffers.colors = new Float32Array([ 1.0, 0.0, 0.0,
                                        0.0, 1.0, 0.0,
                                        0.0, 0.0, 1.0]);
        // Setup a single triangle connecting the vertices so that there
        // is a solid shaded region
        buffers.indices = new Uint16Array([0, 1, 2]);
        super.setupBuffers(buffers);
        this.render();
    }


    /**
     * Draw using WebGL
     */
    render() {
        let shader = this.shader;
        let gl = this.glcanvas.gl;
        gl.useProgram(shader);
    
        //  Bind color, vertex, and index buffers to draw the triangle
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(shader.colorLocation, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
}

