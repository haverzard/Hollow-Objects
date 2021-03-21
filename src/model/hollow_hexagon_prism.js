class HollowHexagonPrism extends HollowObject {
    /**
     * Constructor
     * @param {int} side_length 
     * @param {int} frame_thickness 
     * @param {JSON} data
     */
    constructor(data = null, side_length = 1, frame_thickness = 0.1) {
        super()
        // load from ext file
        if (data) {
            this.side_length = data["side_length"];
            this.frame_thickness = data["frame_thickness"];
        } else {
            this.side_length = side_length;
            this.frame_thickness = frame_thickness;
        }
        
        // rad version of angles
        let rad_60 = getRad(60);
        let rad_30 = getRad(30);

        // base coords for x and z coords in cartesian
        this.COORD_BASE = [
            [0, -this.side_length],
            [this.side_length * Math.cos(rad_30), -this.side_length * Math.sin(rad_30)],
            [this.side_length * Math.cos(rad_30), this.side_length * Math.sin(rad_30)],
            [0, this.side_length],
            [-this.side_length * Math.cos(rad_30), this.side_length * Math.sin(rad_30)],
            [-this.side_length * Math.cos(rad_30), -this.side_length * Math.sin(rad_30)]
        ]

        // modifier for proc generation for x and z coord
        this.MODIFIER = [
            [Math.cos(rad_60), -Math.sin(rad_60)],
            [1, 0],
            [Math.cos(rad_60), Math.sin(rad_60)],
            [-Math.cos(rad_60), Math.sin(rad_60)],
            [-1, 0],
            [-Math.cos(rad_60), -Math.sin(rad_60)]
        ]

        // for sorting faces
        this.FACE_SORT = [
            [0, 3, 2, 1],
            [4, 5, 6, 7],
            [0, 1, 5, 4], 
            [2, 3, 7, 6],
            [1, 2, 6, 5],
            [0, 4, 7, 3]
        ]

        if (data) {
            // load data from ext file
            this.temp_vert = data["vertices"]
            this.temp_color = data["colors"]
            this.temp_normal = data["normal"]
            this.temp_shininess = data["shininess"]
            this.mid = data["mid"]
        } else {
            // temp buffers to generate
            this.temp_vert = [];
            this.temp_color = [];
            this.temp_normal = [];
            this.temp_shininess = [];
            this.mid = [0, this.side_length / 2, 0];
            this.generate()
        }
    }

    /**
     * Add points to vertices buffer using face sort
     * @param {Array of Float} point 
     */
    add_vertices(point) {
        // push to temp buffer with face sort
        for (var j = 0; j < 6; j++) {
            for (var k = 0; k < 4; k++) {
                this.temp_vert.push(point[this.FACE_SORT[j][k] * 3])
                this.temp_vert.push(point[this.FACE_SORT[j][k] * 3 + 1])
                this.temp_vert.push(point[this.FACE_SORT[j][k] * 3 + 2])
            }

            // Prepare to generate normal vector
            var v1 = [
                point[this.FACE_SORT[j][1] * 3] - point[this.FACE_SORT[j][0] * 3],
                point[this.FACE_SORT[j][1] * 3 + 1] - point[this.FACE_SORT[j][0] * 3 + 1],
                point[this.FACE_SORT[j][1] * 3 + 2] - point[this.FACE_SORT[j][0] * 3 + 2]
            ]
            var v2 = [
                point[this.FACE_SORT[j][3] * 3] - point[this.FACE_SORT[j][0] * 3],
                point[this.FACE_SORT[j][3] * 3 + 1] - point[this.FACE_SORT[j][0] * 3 + 1],
                point[this.FACE_SORT[j][3] * 3 + 2] - point[this.FACE_SORT[j][0] * 3 + 2]
            ]

            // Generate normal and shininess coeff
            this.temp_normal.push(getNorm2Vec(v1, v2))
            this.temp_shininess.push(20.0)
        }
    }

    /**
     * Generate prism's base or roof
     * @param {bool} is_roof 
     */
    generate_base(is_roof=false) {
        // For every faces
        for (var i = 0; i < 6; i++) {
            var curIdx = i;
            var nextIdx = (i + 1) % 6;
            var point = []

            // For every frame vertices
            for (var j = 0; j < 8; j++) {
                var ylevel = (is_roof) ? 0 : this.side_length;
                var modx = 0
                var modz = 0
                var idx = curIdx
                if (j % 4 == 2 || j % 4 == 3) {
                    ylevel = (is_roof) ? -this.frame_thickness : this.side_length + this.frame_thickness;
                }
                if (j % 4 == 3 || j % 4 == 0) {
                    modx = this.frame_thickness * this.MODIFIER[i][0]
                    modz = this.frame_thickness * this.MODIFIER[i][1]
                }
                if (j > 3) {
                    idx = nextIdx
                }
                point.push(this.COORD_BASE[idx][0] + modx)
                point.push(ylevel)
                point.push(this.COORD_BASE[idx][1] + modz)
            }

            this.add_vertices(point)
        }
    }

    /**
     * Generate connector
     */
    generate_connector() {
        var rad_30 = getRad(30);

        // for every base vertices
        for (var i = 0; i < 6; i++) {
            var point = []
            var curIdx = i
            var prevIdx = (((i - 1) % 6) + 6) % 6

            // for every vertices in the block
            for (var j = 0; j < 8; j++) {
                var ylevel = -this.frame_thickness
                var modx = 0
                var modz = 0
                if (j % 4 == 1) {
                    modx = this.frame_thickness * this.MODIFIER[curIdx][0]
                    modz = this.frame_thickness * this.MODIFIER[curIdx][1]
                }
                if (j % 4 == 2) {
                    modx =  this.frame_thickness * (Math.cos(rad_30) + Math.tan(rad_30) * Math.sin(rad_30)) * Math.cos(getRad(90 - 60 * i))
                    modz = -this.frame_thickness * (Math.cos(rad_30) + Math.tan(rad_30) * Math.sin(rad_30)) * Math.sin(getRad(90 - 60 * i))
                }
                if (j % 4 == 3) {
                    modx = this.frame_thickness * this.MODIFIER[prevIdx][0]
                    modz = this.frame_thickness * this.MODIFIER[prevIdx][1]
                }
                if (j > 3) {
                    ylevel = this.frame_thickness + this.side_length
                }
                point.push(this.COORD_BASE[i][0] + modx)
                point.push(ylevel)
                point.push(this.COORD_BASE[i][1] + modz)
            }

           this.add_vertices(point)
        }
    }

    /**
     * Generate color on the prism
     */
    generate_color() {
        var face_colors = [
            [0.0,  0.0,  0.0],    // Front face: black
            [1.0,  0.0,  0.0],    // Back face: red
            [0.0,  1.0,  0.0],    // Top face: green
            [0.0,  0.0,  1.0],    // Bottom face: blue
            [1.0,  1.0,  0.0],    // Right face: yellow
            [1.0,  0.0,  1.0]     // Left face: purple
        ]
        
        // Generate for base and roof
        for (var i = 0; i < 72; i++) {
            let c = face_colors[i % 6]
            this.temp_color = this.temp_color.concat(c, c, c, c)
        }

        // Generate for connector
        for (var i = 0; i < 36; i++) {
            var c
            if (i % 6 == 0 || i % 6 == 1) {
                c = face_colors[3] // Blue for bases and roofs
            } else {
                c = face_colors[5] // Purple for sides
            }
            this.temp_color = this.temp_color.concat(c, c, c, c)
        }
    }   

    /**
     * Generate hollow hexagon prism
     */
    generate() {
        this.generate_base(false);
        this.generate_base(true);
        this.generate_connector();
        this.generate_color();
    }

    /**
     * Draw the hollow object
     * @param {gl} gl 
     * @param {shaderProgram} shaderProgram 
     */
    draw(gl, shaderProgram) { // still placeholder
        setMatTransform(gl, shaderProgram, "u_View", this.ViewMatrix)
        var vertex_buffer = createBuffer(gl, this.temp_vert)

        // bind buffer to attribute in shaders
        bindBuffer(gl, shaderProgram, vertex_buffer, 3, 'position')

        // draw every single face with corresponding normals and shininess
        var idx = 0;
        var colIdx = 0
        for (var i = 0; i < 24 * 18; i += 4) {
            // set normal and shininess for every shape
            setVector3D(gl, shaderProgram, "u_color", new Float32Array(this.temp_color.slice(idx * 3, idx * 3 + 3)))
            setVector3D(gl, shaderProgram, "u_normal", new Float32Array(this.temp_normal[idx]))
            gl.uniform1f(gl.getUniformLocation(shaderProgram, "u_shininess"), this.temp_shininess[idx])

            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer)
        
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clearDepth(1.0);

            gl.drawArrays(gl.TRIANGLE_FAN, i, 4)
            idx++;
        } 
    }

    /**
     * Parse object to external file
     */
    parse() {
        for (let i = 0; i < this.temp_vert.length; i += 12) {
            var verts = []
            for (let j = i; j < i + 12 ; j += 3) {
                verts.push(this.temp_vert.slice(j, j + 3))
            }
            verts = to3D(matMult(to4D(verts), transpose(this.ViewMatrix))).flat()
            this.temp_vert.splice(i, 12, ...verts)
        }
        for (let i = 0; i < this.temp_normal.length; i++) {
            var norms = to3D(matMult(to4D([this.temp_normal[i]]), transpose(this.ViewMatrix)))[0]
            this.temp_normal.splice(i, 1, norms)
        }
        let parsed = { 
            "type": "hexagonal_prism",
            "side_length": this.side_length,
            "frame_thickness": this.frame_thickness,
            "mid": this.mid,
            "vertices" : this.temp_vert,
            "colors" : this.temp_color,
            "normal" : this.temp_normal,
            "shininess" : this.temp_shininess        
        }

        return parsed
    }

    /**
     * Apply the transformation
     */
    applyTransformation() {
        this.mid= to3D(matMult(to4D([this.mid]), transpose(this.ViewMatrix)))[0]
        for (let i = 0; i < this.temp_vert.length; i += 12) {
            var verts = []
            for (let j = i; j < i + 12 ; j += 3) {
                verts.push(this.temp_vert.slice(j, j + 3))
            }
            verts = to3D(matMult(to4D(verts), transpose(this.ViewMatrix))).flat()
            this.temp_vert.splice(i, 12, ...verts)
        }
        for (let i = 0; i < this.temp_normal.length; i++) {
            var norms = to3D(matMult(to4D([this.temp_normal[i]]), transpose(this.ViewMatrix)))[0]
            this.temp_normal.splice(i, 1, norms)
        }
        this.resetViewMatrix()
    }
}