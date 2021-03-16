class MainView {
    constructor() {
        // init canvas
        this.canvas = document.getElementById('main-view')
        this.canvas.width = window.innerHeight * 0.90
        this.canvas.height = window.innerHeight * 0.90
    
        // attributes
        this.gl = getGL(this.canvas)
        // init GL
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        // load shader
        this.shaderProgram = loadShader(this.gl, norm2dVertex, colorFrag)

        // init matrix transform
        this.ProjectionMatrix = getIdentityMat()
        this.ModelMatrix = getSMat([3,3,3])
        setMatTransform(this.gl, this.shaderProgram, "u_Projection", this.ProjectionMatrix)
        setMatTransform(this.gl, this.shaderProgram, "u_Model", this.ModelMatrix)
    }
}
  