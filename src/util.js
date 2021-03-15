const SCREEN_RESOLUTION = 5
const ASPECT_RATIO = window.innerWidth / window.innerHeight

function normalizeX(canvas, x) {
    return (x * SCREEN_RESOLUTION * 2) / canvas.width - SCREEN_RESOLUTION
}

function normalizeY(canvas, y) {
    return (-y * SCREEN_RESOLUTION * 2) / canvas.height + SCREEN_RESOLUTION
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