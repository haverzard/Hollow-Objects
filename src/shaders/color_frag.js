function colorFrag() {
  return `
    precision mediump float;

    uniform vec3 u_color;
    uniform highp vec3 u_ambient;
    uniform highp vec3 u_viewer;
    uniform highp vec3 u_light;
    uniform float u_shininess;

    varying highp vec4 v_Normal;

    void main() {
      highp vec3 lightColor = vec3(500000, 500000, 500000);
      highp vec3 l = normalize(u_light - gl_FragCoord.xyz);
      highp float dir = max(dot(v_Normal.xyz, l), 0.0);

      highp vec3 v = normalize(u_viewer - gl_FragCoord.xyz);
      highp vec3 h = (l + v) / length(l + v);
      highp float d = (length(u_light - gl_FragCoord.xyz));
      highp vec3 phong = u_ambient + (dir * lightColor + pow(dot(v_Normal.xyz, h), u_shininess) * lightColor) / (0.2 * pow(d, 2.0) - 1.2 * d + 50.0);
      gl_FragColor = vec4(u_color * phong, 1.0);
    }
    `
}
