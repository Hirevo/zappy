import * as THREE from "three"

export default class GUIManagger {
    private static _instance : GUIManagger;
    private scene: THREE.Scene;
    private mixers: THREE.AnimationMixer[];
    private clock: THREE.Clock;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private audio: THREE.AudioListener;


    private constructor() {
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.mixers = [];
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
        });
        this.audio = new THREE.AudioListener();

        this.camera.add(this.audio);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize, false);
    }

    private onWindowResize : EventListenerOrEventListenerObject = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    public static getInstance() : GUIManagger {
        return this._instance || (this._instance = new this());
    }

    public getMixers() : THREE.AnimationMixer[] {
        return this.mixers;
    }

    public getClock() : THREE.Clock {
        return this.clock;
    }

    public getRenderer() : THREE.WebGLRenderer {
        return this.renderer;
    }

    public getScene() : THREE.Scene {
        return this.scene;
    }

    public getCamera() : THREE.Camera {
        return this.camera;
    }

    public getAudio() : THREE.AudioListener {
        return this.audio;
    }
}