function norm2dVertex() {
  return `
    attribute vec3 position;

    uniform mat4 u_Projection;
    uniform mat4 u_Model;
    uniform mat4 u_View;
    uniform vec3 u_normal;
    uniform vec3 u_color;
    uniform highp vec3 u_direction;
    uniform highp vec3 u_ambient;

    varying highp vec3 vLighting;
    varying vec3 vColor;

    void main() {
      gl_Position = u_Projection * u_Model * u_View * vec4(position, 1.0);
      vColor = u_color;

      highp vec4 new_Normal = u_Projection * u_Model * u_View * vec4(u_normal, 1.0);

      highp vec3 dirLightColor = vec3(1.5, 1.5, 1.5);
      highp float dir = max(dot(new_Normal.xyz, u_direction), 0.0);

      vLighting = u_ambient + (dirLightColor * dir);
    }
    `
}
