class HollowTriangle extends HollowObject {
    constructor(length=1) {
        super()
        this.length = length
        this.shape = Array(3)
        this.normal = [0,0,1]
    }

    setNormal(normal) {
        this.normal = normal
        this.initialize()
    }

    initialize() {
        const rad = getRad(60),
        c = Math.cos(rad),
        s = Math.sin(rad),
        t = Math.tan(rad),
        stroke = 0.25,
        d = this.length

        this.shape[0] = new Shape([
            [-d,            -d/3*t,             0],
            [-d+stroke,     -d/3*t,             0],
            [stroke*c,      d*2/3*t-stroke*s,   0],
            [0,             d*2/3*t,            0],
        ], this.color, this.normal)
        this.shape[1] = new Shape([
            [-d,            -d/3*t,             0],
            [-d+stroke*c,   -d/3*t+stroke*s,    0],
            [d-stroke*c,    -d/3*t+stroke*s,    0],
            [d,             -d/3*t,             0],
        ], this.color, this.normal)
        this.shape[2] = new Shape([
            [0,             d*2/3*t,            0],
            [-stroke*c,     d*2/3*t-stroke*s,   0],
            [d-stroke,      -d/3*t,             0],
            [d,             -d/3*t,             0],
        ], this.color, this.normal)
    }

    draw(gl, shaderProgram) {
        if (!this.shape[0] || this.shape[0][0] != -this.length) this.initialize()
        setMatTransform(gl, shaderProgram, "u_View", this.ViewMatrix)
        for (let i = 0; i < 3; i++) this.shape[i].draw(gl, shaderProgram)
    }

    parse() {
        if (!this.shape[0] || this.shape[0][0] != -this.length) this.initialize()
        let parsed = {}
        for (let i = 0; i < 3; i++) {
            parsed["part_"+i] = {
                "vertices": to3D(matMult(to4D(this.shape[i].vertices), transpose(this.ViewMatrix))),
                "color": this.shape[i].color,
            }
        }
        return parsed
    }
}