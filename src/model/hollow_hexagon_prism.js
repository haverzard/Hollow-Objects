class HollowHexagonPrism extends HollowObject {
    constructor(side_length = 0.5, frame_thickness = 0.1) {
        super()
        this.side_length = side_length;
        this.frame_thickness = frame_thickness;

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

        // temp buffers
        this.temp_vert = [];
        this.temp_color = []
    }

    /**
     * Generate prism's base or roof
     * @param {Is roof} is_roof 
     */
    generate_base(is_roof = false) {
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

            // push to temp buffer with face sort
            for (var j = 0; j < 6; j++) {
                for (var k = 0; k < 4; k++) {
                    this.temp_vert.append(point[this.FACE_SORT[j][k] * 3])
                    this.temp_vert.append(point[this.FACE_SORT[j][k] * 3 + 1])
                    this.temp_vert.append(point[this.FACE_SORT[j][k] * 3 + 2])
                }
            }
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
            var prevIdx = (i - 1) % 6

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
                point.append(this.COORD_BASE[i][0] + modx)
                point.append(ylevel)
                point.append(this.COORD_BASE[i][1] + modz)
            }

            // sort using the face sort
            for (var j = 0; j < 6; j++) {
                for (var k = 0; k < 4; k++) {
                    this.temp_vert.append(point[this.FACE_SORT[j][k] * 3])
                    this.temp_vert.append(point[this.FACE_SORT[j][k] * 3 + 1])
                    this.temp_vert.append(point[this.FACE_SORT[j][k] * 3 + 2])
                }
            }
        }
    }

    /**
     * Generate hexagon prism
     */
    generate() {
        generate_base(is_roof = false);
        generate_base(is_roof = true);
        generate_connector();
        // generate_color();
    }

    draw(gl, shaderProgram) { // still placeholder
        // create buffer for vertex, color, & depth - for shaders
        var vertex_buffer = createBuffer(gl, this.vertices.flat())

        // bind buffer to attribute in shaders
        bindBuffer(gl, shaderProgram, vertex_buffer, 3, 'position')
        gl.uniform3fv(gl.getUniformLocation(shaderProgram, "color"), this.color)

        /* Step5: Drawing the required object (triangle) */
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer)
    
        // Enable the depth test
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearDepth(1.0);
    
        // Draw the triangles
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length)
    }

    parse() {
        let parsed = {"type": "hexagonal_prism"}
        // TBD, scrapped
    }
}