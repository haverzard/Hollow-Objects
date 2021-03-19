const modes = ["rotate", "translate", "scale"]
const proj = ["ortho", "pspec", "oblique"]
const confirmations = ["apply", "cancel"]

class Observer {
    constructor() {
        this.selected = null
        this.mode = MODE.NONE
        this.projMode = PROJ.ORTHO
        this.initProjection()
        this.initObjects()
        this.initInputs()
        this.initButtons()
        this.initTransforms()

        this.main = new MainView(this)
        this.applyProjection()
    }

    initProjection() {
        this.projection = {
            "left": -1,
            "right": 1,
            "bottom": -1,
            "top": 1,
            "near": 0.01,
            "far": 100,
            "xz-deg": 60,
            "yz-deg": 60,
            "fovy": 45,
            "aspect": 1,
        }
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

        proj.forEach((m) => {
            if (m === PROJ.OBLIQUE) {
                document.getElementById(m+'-sec').childNodes.forEach((child) => {
                    child.hidden = true
                })
            } else if (m === PROJ.PSPEC) {
                document.getElementById(m+'-sec').hidden = true
            } else {
                document.getElementById(m+'-btn').classList.toggle("selected")
            }
            document.getElementById(m+"-btn").onclick = () => {
                document.getElementById(this.projMode+'-btn').classList.toggle("selected", false)
                if (this.projMode !== PROJ.PSPEC) {
                    document.getElementById(this.projMode+'-sec').childNodes.forEach((child) => {
                        child.hidden = true
                    })
                } else {
                    document.getElementById(this.projMode+'-sec').hidden = true
                }

                this.projMode = m
                if (m !== PROJ.PSPEC) {
                    document.getElementById(m+'-sec').childNodes.forEach((child) => {
                        child.hidden = false
                    })
                } else {
                    document.getElementById(m+'-sec').hidden = false
                }
                document.getElementById(m+'-btn').classList.toggle("selected")
                this.applyProjection();
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
        document.getElementById("reset-btn").onclick = () => {
            this.projMode = PROJ.ORTHO
            this.initProjection()
            this.applyProjection()
            this.resetProjs()
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
            this.resetTrf()
            document.getElementById(this.mode+'-btn').classList.toggle("selected", false)
            this.mode = MODE.NONE

            confirmations.forEach((k) => {
                document.getElementById(k+'-btn').hidden = true
            })
        }

        this.drawObjects(this.main.gl, this.main.shaderProgram)
    }

    applyProjection() {
        let projectionMatrix
        if (this.projMode === PROJ.ORTHO) { 
            projectionMatrix = getOrthoMat(
                this.projection["left"],
                this.projection["right"],
                this.projection["bottom"],
                this.projection["top"],
                this.projection["near"],
                this.projection["far"]
            )
        } else if (this.projMode === PROJ.PSPEC) {
            projectionMatrix = getPerspectiveMat(
                this.projection["fovy"],
                this.projection["aspect"],
                this.projection["near"],
                this.projection["far"]
            )
        } else {
            projectionMatrix = getObliqueMat(
                this.projection["left"],
                this.projection["right"],
                this.projection["bottom"],
                this.projection["top"],
                this.projection["near"],
                this.projection["far"],
                this.projection["xz-deg"],
                this.projection["yz-deg"]
            )
        }
        setMatTransform(this.main.gl, this.main.shaderProgram, "u_Projection", projectionMatrix)
        this.drawObjects(this.main.gl, this.main.shaderProgram)
    }

    resetTrf() {
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

    resetProjs() {
        proj.forEach((m) => {
            let t
            if (m === PROJ.OBLIQUE) {
                document.getElementById(m+'-sec').childNodes.forEach((child) => {
                    child.hidden = true
                })
                t = ["left", "right", "top", "bottom", "near", "far", "xz", "yz"]
            } else if (m === PROJ.PSPEC) {
                document.getElementById(m+'-sec').hidden = true
                t = ["fovy", "aspect", "near", "far"]
            } else {
                document.getElementById(m+'-btn').classList.toggle("selected")
                t = ["left", "right", "top", "bottom", "near", "far"]
            }
            t.forEach((e) => {
                document.getElementById(m+'-'+e).value = this.projection[e]
            })
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
                    this.transform[k][i] = parseFloat(e.target.value)
                    this.applyTransformation()
                }
            }
        })

        document.getElementById("scale").oninput = (e) => {
            this.transform["scale"] = parseFloat(e.target.value)
            this.applyTransformation()
        }

        proj.forEach((p) => {
            document.getElementById(p+'-near').oninput = (e) => {
                this.projection["near"] = parseFloat(e.target.value)
                this.applyProjection()
            }
            document.getElementById(p+'-far').oninput = (e) => {
                this.projection["far"] = parseFloat(e.target.value)
                this.applyProjection()
            }
            if (p !== PROJ.PSPEC) {
                document.getElementById(p+'-left').oninput = (e) => {
                    this.projection["left"] = parseFloat(e.target.value)
                    this.applyProjection()
                }
                document.getElementById(p+'-right').oninput = (e) => {
                    this.projection["right"] = parseFloat(e.target.value)
                    this.applyProjection()
                }
                document.getElementById(p+'-bottom').oninput = (e) => {
                    this.projection["bottom"] = parseFloat(e.target.value)
                    this.applyProjection()
                }
                document.getElementById(p+'-top').oninput = (e) => {
                    this.projection["top"] = parseFloat(e.target.value)
                    this.applyProjection()
                }
            } else {
                document.getElementById(p+'-fovy').oninput = (e) => {
                    this.projection["fovy"] = parseFloat(e.target.value)
                    this.applyProjection()
                }
                document.getElementById(p+'-aspect').oninput = (e) => {
                    this.projection["aspect"] = parseFloat(e.target.value)
                    this.applyProjection()
                }
            }
            if (p === PROJ.OBLIQUE) {
                document.getElementById(p+'-xz').oninput = (e) => {
                    this.projection["xz-deg"] = parseFloat(e.target.value)
                    this.applyProjection()
                }
                document.getElementById(p+'-yz').oninput = (e) => {
                    this.projection["yz-deg"] = parseFloat(e.target.value)
                    this.applyProjection()
                }
            }
        })
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
        // auto cancel transformation
        if (this.selected != idx && this.mode) {
            this.initTransforms()
            this.resetTrf()

            this.objects[this.selected].resetViewMatrix()
            this.drawObjects(this.main.gl, this.main.shaderProgram)

            document.getElementById(this.mode+'-btn').classList.toggle("selected", false)
            this.mode = MODE.NONE
            confirmations.forEach((k) => {
                document.getElementById(k+'-btn').hidden = true
            })
        }
        this.selected = idx
    }

}
