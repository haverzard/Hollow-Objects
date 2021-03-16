class HollowObject {
    constructor() {
        this.ViewMatrix = getIdentityMat()
    }

    setColor(color) {
        this.color = color
    }

    setViewMatrix(mat) {
        this.ViewMatrix = mat
    }

    resetViewMatrix() {
        this.ViewMatrix = getIdentityMat()
        return this
    }

    addScaling(scale) {
        this.ViewMatrix = matMult(getSMat(Array(3).fill(scale)), this.ViewMatrix)
        return this
    }

    addTranslation(translate) {
        this.ViewMatrix = matMult(getTMat(translate), this.ViewMatrix)
        return this
    }

    addRotateX(deg) {
        this.ViewMatrix = matMult(getRxMat(deg), this.ViewMatrix)
        return this
    }

    addRotateY(deg) {
        this.ViewMatrix = matMult(getRyMat(deg), this.ViewMatrix)
        return this
    }

    addRotateZ(deg) {
        this.ViewMatrix = matMult(getRzMat(deg), this.ViewMatrix)
        return this
    }

    addViewMatrix(ViewMatrix) {
        this.ViewMatrix = matMult(ViewMatrix, this.ViewMatrix)
        return this
    }
}