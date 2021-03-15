class AdaptedHollowPyramid extends HollowObject {
    constructor(data) {
        super()
        this.data = JSON.parse(data)
        this._toShape()
    }

    _toShape() {
        let keys = [
            "o_bottom", "o_front_0", "o_front_1", "o_front_2",
            "i_bottom", "i_front_0", "i_front_1", "i_front_2"
        ]
        let parts = ["part_0", "part_1", "part_2"]
        keys.forEach((k) => {
            for (let i = 0; i < 3; i++) {
                let part = this.data[k][parts[i]]
                this.data[k][parts[i]] = new Shape(part["vertices"], part["color"])
            }
        })
    }

    draw(gl, shaderProgram) {
        setMatTransform(gl, shaderProgram, "MV", getIdentityMat())
        let keys = [
            "o_bottom", "o_front_0", "o_front_1", "o_front_2",
            "i_bottom", "i_front_0", "i_front_1", "i_front_2"
        ]
        let parts = ["part_0", "part_1", "part_2"]
        keys.forEach((k) => {
            for (let i = 0; i < 3; i++) {
                this.data[k][parts[i]].draw(gl, shaderProgram)
            }
        })
    }
}