const keys = [
    "o_bottom", "o_front_0", "o_front_1", "o_front_2",
    "i_bottom", "i_front_0", "i_front_1", "i_front_2"
]
const parts = ["part_0", "part_1", "part_2"]

class HollowPyramid extends HollowObject {
    constructor(color=[0,1,0]) {
        super()
        this.mid = [0,0,0]
        this.shapes = {}
        this.generate(color)
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
        this.shapes["o_bottom"] = shape

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
            this.shapes["o_front_"+i] = shape
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
        this.shapes["i_bottom"] = shape

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
            this.shapes["i_front_"+i] = shape
        }
    }

    draw(gl, shaderProgram) {
        this.shapes.forEach((shape) => {
            shape.draw(gl, shaderProgram)
        })
    }

    parse() {
        let parsed = { "type": "triangular_pyramid", "mid": this.mid }
        keys.forEach((k) => {
            let o = this.shapes[k].ViewMatrix
            this.shapes[k].addViewMatrix(this.ViewMatrix)
            parsed[k] = this.shapes[k].parse()
            this.shapes[k].setViewMatrix(o)
        })
        return parsed
    }
}