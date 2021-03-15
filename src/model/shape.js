class Shape {
    constructor(vertices, color=[0, 0, 0]) {
        this.vertices = vertices
        this.color = color
    }

    draw(gl, shaderProgram) {
        // create buffer for vertex, color, & depth - for shaders
        var vertex_buffer = createBuffer(gl, this.vertices.flat())

        // bind buffer to attribute in shaders
        bindBuffer(gl, shaderProgram, vertex_buffer, 3, 'position')
        gl.uniform3fv(gl.getUniformLocation(shaderProgram, "color"), this.color)

        /* Step5: Drawing the required object (triangle) */
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer)
    
        // Enable the depth test
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearDepth(1.0);
    
        // Draw the triangles
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length)
    }
}