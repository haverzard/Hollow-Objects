const modes = ["rotate", "translate", "scale"]
const confirmations = ["apply", "cancel"]

class Observer {
    constructor() {
        this.selected = null
        this.mode = MODE.NONE
        this.initObjects()
        this.initInputs()
        this.initButtons()
        this.initTransforms()

        this.main = new MainView(this)
    }

    initTransforms() {
        this.transform = {
            "rotate": [0,0,0],
            "translate": [0,0,0],
            "scale": 1,
        }
    }

    initButtons() {
        for (let i = 0; i < this.objects.length; i++) {
            var button = document.createElement("button")
            button.textContent = "Object "+i
            document.getElementById('btn-container').appendChild(button)
            button.onclick = () => {
                if (this.selected !== null) {
                    document.getElementById('btn-container')
                        .children[this.selected]
                        .classList.toggle("selected", false)
                }
                this.pointToObject(i)
                document.getElementById('btn-container').children[i].classList.toggle("selected")

                modes.forEach((k) => {
                    document.getElementById(k+'-btn').hidden = false
                })
            }
        }

        modes.forEach((k) => {
            document.getElementById(k+"-btn").hidden = true
            document.getElementById(k+"-btn").onclick = () => {
                if (this.mode !== null) {
                    document.getElementById(this.mode+'-btn').classList.toggle("selected", false)
                    document.getElementById(this.mode+"-sec").hidden = true
                }
                this.mode = k
                document.getElementById(k+"-sec").hidden = false
                document.getElementById(k+'-btn').classList.toggle("selected")
                this.applyTransformation();

                confirmations.forEach((k) => {
                    document.getElementById(k+'-btn').hidden = false
                })
            }
        })

        confirmations.forEach((k) => {
            document.getElementById(k+'-btn').hidden = true
        })
        document.getElementById("apply-btn").onclick = () => {
            this.applyTransformation(true)
            this.initTransforms()
        }
        document.getElementById("cancel-btn").onclick = () => {
            this.initTransforms()
            this.applyTransformation(true)
        }
    }

    applyTransformation(perm=false) {
        this.objects[this.selected]
            .resetViewMatrix()
            .addTranslation(neg(this.objects[this.selected].mid))

        if (this.mode == MODE.ROTATE) {
            this.objects[this.selected]
                .addRotateX(this.transform["rotate"][0])
                .addRotateY(this.transform["rotate"][1])
                .addRotateZ(this.transform["rotate"][2])
        } else if (this.mode == MODE.TRANSLATE) {
            this.objects[this.selected].addTranslation(this.transform["translate"])
        } else {
            this.objects[this.selected].addScaling(this.transform["scale"])
        }

        this.objects[this.selected].addTranslation(this.objects[this.selected].mid)

        if (perm) {
            this.objects[this.selected].applyTransformation()
            this.resetInputs()
            document.getElementById(this.mode+'-btn').classList.toggle("selected", false)
            this.mode = MODE.NONE

            confirmations.forEach((k) => {
                document.getElementById(k+'-btn').hidden = true
            })
        }

        this.drawObjects(this.main.gl, this.main.shaderProgram)
    }

    resetInputs() {
        modes.forEach((k) => {
            document.getElementById(k+"-sec").hidden = true
        })
        modes.slice(0, 2).forEach((k) => {
            for (let i = 0; i < 3; i++) {
                document.getElementById(k+"-"+i).value = 0
            }
        })
        document.getElementById("scale").value = 0
    }

    initInputs() {
        modes.forEach((k) => {
            document.getElementById(k+"-sec").hidden = true
        })

        modes.slice(0, 2).forEach((k) => {
            for (let i = 0; i < 3; i++) {
                document.getElementById(k+"-"+i).oninput = (e) => {
                    this.transform[k][i] = e.target.value
                    this.applyTransformation()
                }
            }
        })

        document.getElementById("scale").oninput = (e) => {
            this.transform["scale"] = e.target.value
            this.applyTransformation()
        }
    }

    initObjects() {
        this.objects = [new HollowPyramid(), new HollowPyramid(), new HollowHexagonPrism()]
        this.objects[0].addViewMatrix(getSMat([3, 3, 3]))
        this.objects[0].addViewMatrix(getTMat([0, 0.1, 0]))
        this.objects[0] = new AdaptedHollowPyramid(JSON.stringify(this.objects[0].parse()))
        this.objects[0].addViewMatrix(getTMat([0, 0.1, 0]))
        this.objects[0].addScaling(0.5)
        this.objects[0].applyTransformation()

        this.objects[1].addViewMatrix(getSMat([3, 3, 3]))
        this.objects[1].addViewMatrix(getTMat([0, 0.1, 0]))
        this.objects[1] = new AdaptedHollowPyramid(JSON.stringify(this.objects[1].parse()))
        this.objects[1].addViewMatrix(getTMat([0, 1, 0]))
        this.objects[1].addRotateX(30)
        this.objects[1].addRotateY(30)
        this.objects[1].addScaling(0.5)
        this.objects[1].applyTransformation()

        this.objects[2].generate()
        this.objects[2].applyTransformation()
    }

    drawObjects(gl, shaderProgram) {
        gl.clearColor(1.0, 1.0, 1.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        this.objects.forEach((obj, i) => {
            obj.draw(gl, shaderProgram)
        })
    }

    pointToObject(idx) {
        this.selected = idx
    }

}
