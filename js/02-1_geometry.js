import * as THREE from "../build/three.module.js";

class App {
  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer.domElement);
    this._renderer = renderer;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupModel();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 50;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupModel() {
    /* Object3D 타입의 태양 객체 생성 */
    const solarSystem = new THREE.Object3D();
    this._scene.add(solarSystem);

    /* 구 모양의 geometry 생성 */
    const radius = 1;
    const widthSegment = 12;
    const heightSegment = 12;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegment,
      heightSegment
    );

    /* 태양의 재질 */
    const sunMaterial = new THREE.MeshPhongMaterial({
      emissive: 0xffff00,
      flatShading: true,
    });

    /* 태양 mesh를 태양 객체에 추가 */
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(3, 3, 3);
    solarSystem.add(sunMesh);

    /* 지구 */
    const earthOrbit = new THREE.Object3D();
    /* 지구 객체를 태양 객체의 자식으로 추가 */
    solarSystem.add(earthOrbit);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2223ff,
      emissive: 0x111244,
      flatShading: true,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    /* 태양 객체로 부터 10만큼 떨어진 곳에 배치 */
    earthOrbit.position.x = 10;
    earthOrbit.add(earthMesh);

    /* 달 */
    const moonOrbit = new THREE.Object3D();
    /* 달 객체는 지구 객체의 자식이므로 지구를 기준으로 2만큼 떨어진 곳에 배치됨 (태양 기준 12) */
    moonOrbit.position.x = 2;
    /* 달 객체를 지구 객체의 자식으로 추가 */
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
      flatShading: true,
    });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);

    /* 다른 메서드에서 참조 할 수 있도록 field 화 */
    this._solarSystem = solarSystem;
    this._earthOrbit = earthOrbit;
    this._moonOrbit = moonOrbit;
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  render(time) {
    this._renderer.render(this._scene, this._camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001; // second unit

    /* 태양 객체를 y 축을 기준으로 회전 : 지구와 달도 태양을 중심으로 회전 */
    this._solarSystem.rotation.y = time / 2;

    this._earthOrbit.rotation.y = time * 2;
    this._moonOrbit.rotation.y = time * 5;
  }
}

window.onload = function () {
  new App();
};
