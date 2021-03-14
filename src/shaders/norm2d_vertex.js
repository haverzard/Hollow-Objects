function norm2dVertex() {
  return `
    attribute vec3 position;
    uniform mat4 S;
    uniform mat4 T;
    uniform mat4 R;
    uniform vec3 color;
    varying vec3 vColor;

    void main() {
        gl_Position = T*R*S*vec4(position, 1.0);
        vColor = color;
    }
    `
}
