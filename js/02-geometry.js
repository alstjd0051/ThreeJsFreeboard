// 02-geometry.js
import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../../examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "../../examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "../../examples/jsm/geometries/TextGeometry.js";

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
    /* 마우스 컨트롤 추가 */
    this._setupControls();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupControls() {
    /* new OrbitControls(카메라 객체, 마우스 이벤트를 받는 DOM 요소) */
    new OrbitControls(this._camera, this._divContainer);
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.x = -15;
    camera.position.z = 15;
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
    //const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    //const geometry = new THREE.CircleGeometry(1, 8, 0, Math.PI * 2);
    //const geometry = new THREE.ConeGeometry(1, 1, 8, 1, false, 0, Math.PI * 2);
    //const geometry = new THREE.CylinderGeometry(1, 1, 1, 8, 1, false, 0, Math.PI * 2);
    //const geometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI);
    //const geometry = new THREE.RingGeometry(0.5, 1, 8, 1, 0, Math.PI * 2);
    //const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    //const geometry = new THREE.TorusGeometry(1, 0.4, 8, 6, Math.PI * 2);
    //const geometry = new THREE.TorusKnotGeometry(1, 0.4, 64, 8, 2, 3);

    // ShapeGeometry
    /* const shape = new THREE.Shape();
		const x = -2.5, y = -5;
		shape.moveTo(x + 2.5, y + 2.5);
		shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
		shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
		shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
		shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
		shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
		shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
		const geometry = new THREE.ShapeGeometry(shape); */

    // TubeGeometry
    /* class CustomSinCurve extends THREE.Curve {
			constructor(scale = 1) {
				super();
				this.scale = scale;
			}
			getPoint(t) {
				const tx = t * 3 - 1.5;
				const ty = Math.sin(2 * Math.PI * t);
				const tz = 0;
				return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
			}
		}
		// 튜브가 이어지는 형태를 결정하기 위한 curve 객체 생성
		const path = new CustomSinCurve(4);
		const geometry = new THREE.TubeGeometry(path, 64, 1, 8, false); */

    // LatheGeometry
    /* const points = [];
		for (let i = 0; i < 10; ++i) {
			points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8));
		}
		const geometry = new THREE.LatheGeometry(points, 12, 0, Math.PI * 2); */

    // ExtrudeGeometry
    /* const x = -2.5, y = -5;
		const shape = new THREE.Shape();
		shape.moveTo(x + 2.5, y + 2.5);
		shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
		shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
		shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
		shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
		shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
		shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

		const settings = {
			steps: 1,
			depth: 4,
			bevelEnabled: false,
			bevelThickness: 0.1,
			bevelSize: 0.1,
			bevelSegments: 1,
		}

		const geometry = new THREE.ExtrudeGeometry(shape, settings); */

    //TextGeometry
    // TTF 등과 같은 폰트 파일을 Three.js에서 폰트로 사용할 수 있는 포맷으로 변경해서 사용함 (json)
    // 폰트를 로드
    const fontLoader = new FontLoader();
    // 폰트 데이터를 비동기적으로 불러옴
    async function loadFont(that) {
      const url = "../examples/fonts/helvetiker_regular.typeface.json";
      const font = await new Promise((resolve, reject) => {
        fontLoader.load(url, resolve, undefined, reject);
      });

      const geometry = new TextGeometry("Three", {
        font: font,
        size: 5,
        height: 1.5,
        curveSegments: 4,
        // setting for ExtrudeGeometry
        bevelEnabled: true,
        bevelThickness: 0.7,
        bevelSize: 0.7,
        bevelSegments: 2,
      });

      // 비동기 함수 내부에서 geometry 를 생성하고 있기 때문에 기존의 모든 코드도 비동기 함수 내부에서 호출해야함
      const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
      const cube = new THREE.Mesh(geometry, fillMaterial);

      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
      const line = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        lineMaterial
      );

      const group = new THREE.Group();
      group.add(cube);
      group.add(line);

      that._scene.add(group);
      that._cube = group;
    }
    loadFont(this);

    /* // 회색 색상의 재질
		const fillMaterial = new THREE.MeshPhongMaterial({color: 0x515151});
		// mesh 타입의 오브젝트 생성
		const cube = new THREE.Mesh(geometry, fillMaterial);

		// 노란색 선에 대한 재질
		const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
		// line 타입의 오브젝트 생성
		const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial);

		const group = new THREE.Group();
		group.add(cube);
		group.add(line);

		this._scene.add(group);
		this._cube = group; */
  }

  /* _setupModel() {
		// shape method
		const shape = new THREE.Shape();
		const x = -2.5, y = -5;
		shape.moveTo(x + 2.5, y + 2.5);
		shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
		shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
		shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
		shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
		shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
		shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

		const geometry = new THREE.BufferGeometry();
		const points = shape.getPoints();
		geometry.setFromPoints(points);

		const material = new THREE.LineBasicMaterial({color: 0xffff00});
		const line = new THREE.Line(geometry, material);

		this._scene.add(line);
	} */

  /* _setupModel() {
		// curve class
		// 커브를 t 매개변수 방정식으로 정의
		class CustomSinCurve extends THREE.Curve {
			constructor(scale = 1) {
				super();
				this.scale = scale;
			}
			getPoint(t) {
				const tx = t * 3 - 1.5;
				const ty = Math.sin(2 * Math.PI * t);
				const tz = 0;
				return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
			}
		}

		const path = new CustomSinCurve(4);

		const geometry = new THREE.BufferGeometry();
		// getPoints : 커브를 구성하는 좌표의 개수를 인자로 받는다. 값이 높을 수록 더 부드러운 곡선을 얻는다.
		const points = path.getPoints(10);
		geometry.setFromPoints(points);

		const material = new THREE.LineBasicMaterial({color: 0xffff00});
		const line = new THREE.Line(geometry, material);

		this._scene.add(line);
	} */

  /* _setupModel() {
		const points = [];
		for (let i = 0; i < 10; ++i) {
			points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8));
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setFromPoints(points);

		const material = new THREE.LineBasicMaterial({color: 0xffff00});
		const line = new THREE.Line(geometry, material);

		this._scene.add(line);
	} */

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
    time *= 0.001;

    //this._cube.rotation.x = time;
    //this._cube.rotation.y = time;
  }
}

window.onload = function () {
  new App();
};
