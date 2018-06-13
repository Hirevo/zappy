import * as THREE from "three"

export default class GUIManagger {
    private static _instance : GUIManagger;
    private _scene: THREE.Scene;
    private _camera: THREE.PerspectiveCamera;
    private _renderer: THREE.WebGLRenderer;

    private onWindowResize : EventListenerOrEventListenerObject = () => {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private constructor() {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this._renderer = new THREE.WebGLRenderer();

        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);

        window.addEventListener('resize', this.onWindowResize, false);
    }

    public static getInstance() : GUIManagger {
        return this._instance || (this._instance = new this());
    }

    public getScene() : THREE.Scene {
        return this._scene;
    }

    public getCamera() : THREE.Camera {
        return this._camera;
    }
}