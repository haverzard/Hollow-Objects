class Observer {
    constructor() {
        this.objects = [new HollowPyramid()]
        this.objects[0].addViewMatrix(getSMat([3, 3, 3]))

        this.main = new MainView(this)
    }

    drawObjects(gl, shaderProgram) {
        gl.clearColor(1.0, 1.0, 1.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        this.objects.forEach((obj) => {
            obj.draw(gl, shaderProgram)
        })
    }
}
