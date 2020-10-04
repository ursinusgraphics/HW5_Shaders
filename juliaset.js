/**
 * Split a complex number string into an array of 2 elements
 * @param {String} s "a + bi"
 */
function splitComplexStr(s) {
    ret = [];
    s.split("+").forEach(function(x) {
        if (x.charAt(x.length-1) == "i") {
            x = x.substring(x.length-1);
        }
        ret.push(parseFloat(x));
    });
    return ret;
}

/**
 * Convert a vec2 to a complex string
 * @param {glMatrix.vec2} v Vector
 * @param {int} k Decimal precision
 */
function complexToStr(v, k) {
    if (k === undefined) {
        k = 2;
    }
    s = "";
    for (let i = 0; i < 2; i++) {
        s += v[i].toFixed(k);
        if (i < v.length-1) {
            s += " + ";
        }
        else if (i == 1) {
            s += "i";
        }
    }
    return s;
}


/**
 * A class for storing the shader program and buffers for rendering
 * the Julia Set fractal
 */
class JuliaSetShader extends ShaderProgram {

    clickerDragged(evt) {
        this.clickerDraggedCenterScale(evt);
    }

    /**
     * Asynchronously load the vertex and fragment shaders
     */
    loadShader() {
        let gl = this.glcanvas.gl;
        let juliaShader = getShaderProgramAsync(gl, "juliaset");
        let shaderObj = this;
        juliaShader.then(function(shader) {
            // Extract uniforms and store them in the shader object
            shader.uCenterUniform = gl.getUniformLocation(shader, "uCenter");
            shader.uCUniform = gl.getUniformLocation(shader, "uC");
            shader.uScaleUniform = gl.getUniformLocation(shader, "uScale");
            shader.uEscapeUniform = gl.getUniformLocation(shader, "uEscape");
            shader.uPowsUniform = gl.getUniformLocation(shader, "uPows");
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
        this.setupMenu();
        this.setupMouseHandlers();

        // Setup animation variables
        this.render();
    }


    /**
     * Setup uniforms that will change based on mouse interaction
     * and inputs
     */
    setupMenu() {
        this.CVec = glMatrix.vec2.fromValues(0, 0);
        this.C = complexToStr(this.CVec);
        this.scale = 1;
        this.escape = 2.0;
        this.centervec = glMatrix.vec2.fromValues(0, 0);
        this.powsvec = glMatrix.vec3.fromValues(500, 1000, 100);
        let menu = new dat.GUI();
        this.menu = menu;
        this.center = vecToStr(this.centervec);
        this.pows = vecToStr(this.powsvec);
        let shaderObj = this;
        menu.add(this, 'C').listen().onChange(
            function(value) {
                shaderObj.CVec = splitComplexStr(value);
                requestAnimationFrame(shaderObj.render.bind(shaderObj));
            }
        );
        menu.add(this, 'escape').onChange(this.render.bind(this));
        menu.add(this, 'scale').onChange(this.render.bind(this)).listen();
        menu.add(this, 'center').listen().onChange(
            function(value) {
                let xy = splitVecStr(value);
                for (let k = 0; k < 2; k++) {
                    shaderObj.centervec[k] = xy[k];
                }
                requestAnimationFrame(shaderObj.render.bind(shaderObj));
            }
        );
        menu.add(this, 'pows').listen().onChange(
            function(value) {
                let xyz = splitVecStr(value);
                for (let k = 0; k < 3; k++) {
                    shaderObj.powsvec[k] = xyz[k];
                }
                requestAnimFrame(shaderObj.render.bind(shaderObj));
            }
        );
    }

    /**
     * Draw using WebGL
     */
    render() {
        let gl = this.glcanvas.gl;
        let shader = this.shader;
        gl.useProgram(shader);
        // Step 1: Setup uniform variables that are sent to the shaders
        gl.uniform2fv(shader.uCenterUniform, this.centervec);
        gl.uniform2fv(shader.uCUniform, this.CVec);
        gl.uniform1f(shader.uScaleUniform, this.scale);
        gl.uniform1f(shader.uEscapeUniform, this.escape);
        gl.uniform3fv(shader.uPowsUniform, this.powsvec);

        // Step 2: Bind vertex and index buffers to draw two triangles
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
}



