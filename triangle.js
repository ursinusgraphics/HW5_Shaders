class TriangleShader {
    constructor() {
        let glcanvas = document.getElementById("MainGLCanvas");
        glcanvas.addEventListener("contextmenu", function(e){ e.stopPropagation(); e.preventDefault(); return false; }); //Need this to disable the menu that pops up on right clicking
        
        try {
            glcanvas.gl = glcanvas.getContext("webgl");
            glcanvas.gl.viewportWidth = glcanvas.width;
            glcanvas.gl.viewportHeight = glcanvas.height;
        } catch (e) {
            console.log(e);
        }
        this.glcanvas = glcanvas;
        this.loadShader();
    }

    /**
     * Asynchronously load the vertex and fragment shaders
     */
    loadShader() {
        let gl = this.glcanvas.gl;
        let triShader = getShaderProgramAsync(gl, "triangle");
        let shaderObj = this;
        triShader.then(function(shader) {
            shaderObj.triShader = shader;
            // Extract pointers to position and color buffers, and store them
            // in the shader object
            shader.positionLocation = gl.getAttribLocation(shader, "a_position");
            gl.enableVertexAttribArray(shader.positionLocation);
            shader.colorLocation = gl.getAttribLocation(shader, "a_color");
            gl.enableVertexAttribArray(shader.colorLocation);
            shaderObj.setupBuffers();
        });
    }

    setupBuffers() {
        let gl = this.glcanvas.gl;
        // Setup position and color buffers
        this.positionBuffer = gl.createBuffer();
        this.positions = new Float32Array([-1.0,  1.0,
                                            1.0,  1.0,
                                            -1.0, -1.0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.triShader.positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        this.colorBuffer = gl.createBuffer();
        this.colors = new Float32Array([1.0, 0.0, 0.0,
                                         0.0, 1.0, 0.0,
                                         0.0, 0.0, 1.0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.triShader.colorLocation, 3, gl.FLOAT, false, 0, 0);
        
        // Setup a single triangle connecting the vertices so that there
        // is a solid shaded region
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.tris = new Uint16Array([0, 1, 2]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.tris, gl.STATIC_DRAW);
        this.indexBuffer.itemSize = 1;
        this.indexBuffer.numItems = 3;
        this.render();
    }

    /**
     * Draw using WebGL
     */
    render() {
        let triShader = this.triShader;
        let gl = this.glcanvas.gl;
        gl.useProgram(triShader);
    
        //  Bind color, vertex, and index buffers to draw the triangle
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(triShader.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(triShader.colorLocation, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
}

