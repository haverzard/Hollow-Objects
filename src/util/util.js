const ASPECT_RATIO = 1

function normalizeX(canvas, x) {
    return (x * 2) / canvas.width - 1
}

function normalizeY(canvas, y) {
    return (-y * 2) / canvas.height + 1
}

function getPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return [x, y]
}

function getDeg(rad) {
    return rad * 180 / Math.PI
}

function getRad(degree) {
    return Math.PI * degree / 180
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