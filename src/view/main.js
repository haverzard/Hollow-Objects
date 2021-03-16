class MainView {
    constructor() {
        this.onclick = false

        // init canvas
        this.canvas = document.getElementById('main-view')
        this.canvas.addEventListener('mousedown', (e) => this.onClick(e))
        this.canvas.addEventListener('mouseup', () => this.onUnclick())
        this.canvas.addEventListener('mousemove', (e) => this.rotateMouseMove(e))
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
        this.ModelMatrix = getIdentityMat()
        setMatTransform(this.gl, this.shaderProgram, "u_Projection", this.ProjectionMatrix)
        setMatTransform(this.gl, this.shaderProgram, "u_Model", this.ModelMatrix)
    }

    onClick(e) {
        this.onclick = true
        this.lastPoint = getPosition(this.canvas, e)
    }

    onUnclick() {
        this.onclick = false
    }

    rotateMouseMove(e) {
        if (this.onclick) {
            const position = getPosition(this.canvas, e)
            const dy = (position[0] - this.lastPoint[0]) * 0.5
            const dx = (position[1] - this.lastPoint[1]) * 0.5

            this.ModelMatrix = matMult(matMult(getRxMat(-dx), getRyMat(-dy)), this.ModelMatrix)
            setMatTransform(this.gl, this.shaderProgram, "u_Model", this.ModelMatrix)

            this.lastPoint = position
        }
    }
}
  