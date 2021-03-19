const keys = [
    "o_bottom", "o_front_0", "o_front_1", "o_front_2",
    "i_bottom", "i_front_0", "i_front_1", "i_front_2"
]
const parts = ["part_0", "part_1", "part_2"]

class HollowPyramid extends HollowObject {
    constructor(data=null, color=[0,1,0]) {
        super()
        this.type = "triangular_pyramid"
        if (data) {
            this.mid = data.mid
            this.data = data
            this._toShape()
            delete data.mid
        } else {
            this.mid = [0,0,0]
            this.data = {}
            this.generate(color)
        }
    }

    generate(color) {
        let shape
        const th = Math.tan(getRad(60)) // triangle height
        const prad = (Math.asin(1/3)) // pyramid radian
        const cfp = Math.cos(prad) // cos for pyramid
        const sfp = Math.sin(prad) // sin for pyramid
        /* Outer */
        /*
            Calculation for Bottom Side:
                Rotate 90 degree
                Translate y so y = - 1/3 th
        */
        shape = new HollowTriangle()
        shape
            .addRotateX(90)
            .addTranslation([0, - th/3, 0])
            .addScaling(0.2)
            .addViewMatrix(this.ViewMatrix)
        shape.setColor(color)
        shape.setNormal([0, 0, -1])
        this.data["o_bottom"] = shape.parse()

        /*
            Calculation for Front Side:
                Rotate asin(1/3) degree -> a
                Translate y so y = - 1/3 th
                    -y' = -y + dy -> y' = th/3 & y = cos a * th/3
                    dy = (cos a - 1) * th/3
                Translate z so top of triange at (0, y, 0)
                    -z' = -z + dz -> z' = th/3 & z = sin a * th/3
                    dz = (sin a - 1) * th/3
        */
        for (let i = 0; i < 3; i++) {
            shape = new HollowTriangle()
            shape
                .addRotateX(getDeg(prad))
                .addTranslation([0, (cfp - 1) * th/3, (sfp - 1) * th/3])
                .addScaling(0.2)
                .addRotateY(i*120)
                .addViewMatrix(this.ViewMatrix)
            shape.setColor(color)
            this.data["o_front_"+i] = shape.parse()
        }

        /* Inner */
        const th2 = th * (1 - 0.125) // sin for triangle
        /*
            Calculation for Bottom Side:
                Same as outer, but you need to scale down by 0.125 (up-down)
                Translate y so y = - 1/3 th + du -> du = 0.125 * th + err
        */
        shape = new HollowTriangle(1 - 0.125)
        shape
            .addRotateX(90)
            .addTranslation([0, - th/3 + 0.135 * th2, 0])
            .addScaling(0.2)
            .addViewMatrix(this.ViewMatrix)
        shape.setColor(color)
        this.data["i_bottom"] = shape.parse()

        /*
            Calculation for Front Side:
                Rotate asin(1/3) degree -> a
                Translate y so y = - 1/3 th
                    -y' = -y + dy -> y' = th/3 & y = cos a * th2/3
                    dy = cos a  * th2/3 - th/3
                Translate z so top of triange at (0, y, 0)
                    -z' = -z + dz -> z' = th/3 + 0.125 * th & z = sin a * th2/3
                    dz = sin a * th2/3 - th/3 + 0.125 * th
        */
        for (let i = 0; i < 3; i++) {
            shape = new HollowTriangle(1 - 0.125)
            shape
                .addRotateX(getDeg(prad))
                .addTranslation([0, cfp * th2/3 - th/3, (sfp * th2/3 - th/3) + 0.125 * th])
                .addScaling(0.2)
                .addRotateY(i*120)
                .addViewMatrix(this.ViewMatrix)
            shape.setColor(color)
            shape.setNormal([0, 0, -1])
            this.data["i_front_"+i] = shape.parse()
        }
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

    parse() {
        console.log(this.data)
        let parsed = { "type": "triangular_pyramid", "mid": this.mid }
        keys.forEach((k) => {
            parsed[k] = {}
            for (let i = 0; i < 3; i++) {
                let shape = this.data[k][parts[i]]
                parsed[k][parts[i]] = {
                    "vertices": shape.vertices,
                    "color": shape.color,
                    "normal": shape.normal,
                    "shininess": shape.shininess,
                }
            }
        })
        return parsed
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