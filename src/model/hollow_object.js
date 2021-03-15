class HollowObject {
    constructor() {
        this.MTransform = getIdentityMat()
        this.color = [0,0,0]
    }

    setColor(color) {
        this.color = color
    }

    setMV(mat) {
        this.MTransform = mat
    }

    resetMV() {
        this.MTransform = getIdentityMat()
        return this
    }

    addScaling(scale) {
        this.MTransform = matMult(getSMat(Array(3).fill(scale)), this.MTransform)
        return this
    }

    addTranslation(translate) {
        this.MTransform = matMult(getTMat(translate), this.MTransform)
        return this
    }

    addRotateX(deg) {
        this.MTransform = matMult(getRxMat(deg), this.MTransform)
        return this
    }

    addRotateY(deg) {
        this.MTransform = matMult(getRyMat(deg), this.MTransform)
        return this
    }

    addRotateZ(deg) {
        this.MTransform = matMult(getRzMat(deg), this.MTransform)
        return this
    }

    addMTransform(MTransform) {
        this.MTransform = matMult(MTransform, this.MTransform)
        return this
    }
}