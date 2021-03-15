class MainView {
    constructor() {
        // init canvas
        this.canvas = document.getElementById('main-view')
        this.canvas.width = window.innerWidth * 0.90
        this.canvas.height = window.innerHeight * 0.90
    
        // attributes
        this.gl = getGL(this.canvas)
        // init GL
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  
        // load shader
        this.shaderProgram = loadShader(this.gl, norm2dVertex, colorFrag)
        let shape = new Shape([[0,0,0], [0,1,0], [1,1,0], [1,0,0]])
        shape.draw(this.gl, this.shaderProgram)
    }
}
  