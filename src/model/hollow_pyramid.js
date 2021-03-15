class HollowPyramid extends HollowObject {
    constructor() {
        super()
    }

    draw(gl, shaderProgram) {
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
            .addMTransform(this.MTransform)
        shape.setColor([1, 0, 0])
        shape.draw(gl, shaderProgram)

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
                .addMTransform(this.MTransform)
            shape.setColor([0, 1, 0])
            shape.draw(gl, shaderProgram)
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
            .addMTransform(this.MTransform)
        shape.setColor([0.5, 0, 0])
        shape.draw(gl, shaderProgram)

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
                .addMTransform(this.MTransform)
            shape.setColor([1, 0.5, 0])
            shape.draw(gl, shaderProgram)
        }
    }
}