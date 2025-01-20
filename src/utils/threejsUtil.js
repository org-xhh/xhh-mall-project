import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function initThreeScene(container, canvasWidth, canvasHeight) {
  // 建立场景
  const scene = new THREE.Scene()

  // 透视摄像机，参数：视野角度（FOV），长宽比，近截面（near）和远截面（far）
  const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000)

  // 设置背景色 或 下面的{ alpha: true }
  // scene.background = new THREE.Color('#e3e4e5')
  // 渲染器
  const renderer = new THREE.WebGLRenderer({ alpha: true }) // 透明背景
  // renderer.setClearAlpha(0) // 数值为0.7就是半透明

  renderer.setSize(canvasWidth, canvasHeight)
  // 添加 renderer（渲染器）的dom元素（renderer.domElement）
  container.appendChild(renderer.domElement)

  // BoxGeometry（立方体）对象. 这个对象包含了一个立方体中所有的顶点（vertices）和面（faces）
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  // 立方体材质
  // 定义立方体的各个面的颜色
  const colors = [
    0xff0000, // 右
    0x22b14c, // 左
    0x0000ff, // 上
    0x90b0d6, // 下
    0x990ff5, // 后
    '#94D8F6' // 前
  ]
  const material = colors.map((color) => new THREE.MeshBasicMaterial({ color: color }))
  // const material = new THREE.MeshBasicMaterial({ color: '#990ff5' })
  // Mesh（网格）， 网格包含一个几何体以及作用在此几何体上的材质
  const cube = new THREE.Mesh(geometry, material)
  // 将网格对象放入到场景中
  scene.add(cube)

  // 当我们调用 scene.add() 的时候，物体将会被添加到 (0,0,0) 坐标。
  // 但将使得摄像机和立方体彼此在一起。为了防止这种情况的发生，我们只需要将摄像机稍微向外移动一些即可。
  camera.position.z = 3

  // 创建一个使渲染器能够在每次屏幕刷新时对场景进行绘制的循环
  function animate() {
    requestAnimationFrame(animate)

    // 使立方体自己转动
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01

    renderer.render(scene, camera)
  }

  animate()

  // 鼠标控制
  let controls = null
  initControls()
  cube.rotation.x += 1
  cube.rotation.y += 0.1
  cube.rotation.z += 10
  function initControls() {
    // 轨道控制器，可以使得相机围绕目标进行轨道运动
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target = new THREE.Vector3(0, 0, 0) // 控制焦点
  }
}
