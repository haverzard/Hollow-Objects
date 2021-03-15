class Shape {
    constructor(vertices, color=[0, 0, 0]) {
        this.vertices = vertices
        this.color = color
    }

    draw(gl, shaderProgram) {
        // create buffer for vertex, color, & depth - for shaders
        var vertex_buffer = createBuffer(gl, this.vertices.flat())
        console.log(this.vertices.flat())
        var color_buffer = createBuffer(gl, Array(this.vertices.length).fill(this.color).flat())

        // bind buffer to attribute in shaders
        bindBuffer(gl, shaderProgram, color_buffer, 3, 'color')
        bindBuffer(gl, shaderProgram, vertex_buffer, 3, 'position')

        /* Step5: Drawing the required object (triangle) */
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer)
    
        // Enable the depth test
        // gl.enable(gl.DEPTH_TEST)
    
        // Draw the triangles
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length)
    }
}