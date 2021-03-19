class AdaptedHollowPyramid extends HollowObject {
    constructor(data) {
        super()
        this.data = JSON.parse(data)
        this.mid = this.data.mid
        this._toShape()
    }

    _toShape() {
        keys.forEach((k) => {
            for (let i = 0; i < 3; i++) {
                let part = this.data[k][parts[i]]
                this.data[k][parts[i]] = new Shape(part["vertices"], part["color"], part["normal"], part["shininess"])
            }
        })
    }

    draw(gl, shaderProgram) {
        setMatTransform(gl, shaderProgram, "u_View", this.ViewMatrix)
        keys.forEach((k) => {
            for (let i = 0; i < 3; i++) {
                this.data[k][parts[i]].draw(gl, shaderProgram)
            }
        })
    }

    applyTransformation() {
        this.mid= to3D(matMult(to4D([this.mid]), transpose(this.ViewMatrix)))[0]
        keys.forEach((k) => {
            for (let i = 0; i < 3; i++) {
                this.data[k][parts[i]]["vertices"] = to3D(matMult(to4D(this.data[k][parts[i]]["vertices"]), transpose(this.ViewMatrix)))
                this.data[k][parts[i]]["normal"] = to3D(matMult(to4D([this.data[k][parts[i]]["normal"]]), transpose(this.ViewMatrix)))[0]
            }
        })
        this.resetViewMatrix()
    }
}