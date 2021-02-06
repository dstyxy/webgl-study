
import './stylus/reset.stylus'
import './stylus/main.stylus'


// 顶点找着色器
let vertexShaderSource = `

attribute vec4 a_position;
 
void main() {
  gl_Position = a_position;
}

`

// 片段着色器
let fragmentShaderSource = `
precision mediump float;
 
void main() {
  gl_FragColor = vec4(1, 0, 0.5, 1);
}

`

let canvas = document.createElement('canvas')
let root = document.querySelector('#root')
let w = root.clientWidth
let h = root.clientHeight
canvas.style.width = '100%'
canvas.style.height = '100%'
canvas.width = w
canvas.height = h
root.appendChild(canvas)

let gl = canvas.getContext('webgl')
console.log(gl)

function createShader(gl, type, source) {
  var shader = gl.createShader(type); // 创建着色器对象
  gl.shaderSource(shader, source); // 提供数据源
  gl.compileShader(shader); // 编译 -> 生成着色器
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);


function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}


let program = createProgram(gl, vertexShader, fragmentShader);

let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
let positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

let positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);
gl.enableVertexAttribArray(positionAttributeLocation);

// 将绑定点绑定到缓冲数据（positionBuffer）
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

(() => {
  // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
  let size = 2;          // 每次迭代运行提取两个单位数据
  let type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
  let normalize = false; // 不需要归一化数据
  let stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                         // 每次迭代运行运动多少内存到下一个数据开始点
  let offset = 0;        // 从缓冲起始位置开始读取
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
})()

let primitiveType = gl.TRIANGLES;
let offset = 0;
let count = 3;
gl.drawArrays(primitiveType, offset, count);











