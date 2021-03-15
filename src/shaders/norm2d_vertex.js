function norm2dVertex() {
  return `
    attribute vec3 position;
    attribute vec3 color;
    varying vec3 vColor;

    void main() {
        gl_Position = vec4(position, `+SCREEN_RESOLUTION+`.0);
        vColor = color;
    }
    `
}
