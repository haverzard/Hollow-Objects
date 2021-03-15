const ASPECT_RATIO = 1

function normalizeX(canvas, x) {
    return (x * 2) / canvas.width - 1
}

function normalizeY(canvas, y) {
    return (-y * 2) / canvas.height + 1
}

function getDeg(rad) {
    return rad * 180 / Math.PI
}

function getRad(degree) {
    return Math.PI * degree / 180
}

function getIdentityMat() {
    var mat = []
    for (let i = 0; i < 4; i++) {
        mat.push(Array(4).fill(0.0))
        mat[i][i] = 1.0
    }
    return mat
}

function getZeroMat() {
    var mat = []
    for (let i = 0; i < 4; i++) {
        mat.push(Array(4).fill(0.0))
    }
    return mat
}

function transpose(mat) {
    for (let i = 0; i < 4; i++) {
        for (let j = i+1; j < 4; j++) {
            t = mat[i][j]
            mat[i][j] = mat[j][i]
            mat[j][i] = t
        }
    }
    return mat
}

function matMult(mat1, mat2) {
    var mat = getZeroMat()
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            for (let k = 0; k < 4; k++)
                mat[i][j] += mat1[i][k] * mat2[k][j]
    return mat
}

function getSMat(scale) {
    var mat = getIdentityMat()
    for (let i = 0; i < 3; i++)
        mat[i][i] = scale[i]
    return mat
}

function getTMat(translate) {
    var mat = getIdentityMat()
    for (let i = 0; i < 3; i++)
        mat[i][3] = translate[i]
    return mat
}

function getRxMat(degree) {
    var angle = getRad(degree)
    var c = Math.cos(angle)
    var s = Math.sin(angle)
    var mat = getIdentityMat()
    mat[1][1] = c
    mat[2][2] = c
    mat[1][2] = -s
    mat[2][1] = s
    return mat
}

function getRyMat(degree) {
    var angle = getRad(degree)
    var c = Math.cos(angle)
    var s = Math.sin(angle)
    var mat = getIdentityMat()
    mat[0][0] = c
    mat[2][2] = c
    mat[0][2] = s
    mat[2][0] = -s
    return mat
}

function getRzMat(degree) {
    var angle = getRad(degree)
    var c = Math.cos(angle)
    var s = Math.sin(angle)
    var mat = getIdentityMat()
    mat[0][0] = c
    mat[1][1] = c
    mat[0][1] = -s
    mat[1][0] = s
    return mat
}

function getGL(canvas) {
    var gl = canvas.getContext('webgl')
    if (!gl) {
        gl = canvas.getContext('experimental-webgl')
        if (!gl) alert("Your browser doesn't support WebGL")
        console.log('[Paint] Using experimental WebGL')
    }
    return gl
}

function toggleHelpMenu() {
    const helpMenu = document.getElementById('help')
    if (helpMenu) {
        helpMenu.classList.toggle('hide-menu')
    }
}