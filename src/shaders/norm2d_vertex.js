function norm2dVertex() {
  return `
    attribute vec3 position;
    uniform mat4 C;
    uniform mat4 MV;
    uniform vec3 color;
    varying vec3 vColor;

    void main() {
        gl_Position = C*MV*vec4(position, 1.0);
        vColor = color;
    }
    `
}
