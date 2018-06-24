import * as THREE from "three";
// import Url from "url";
import IState from "./IState";
import StateShare from "./StateShare";
import SocketCom from "../SocketCom";
import StateMachine from "../StateMachine";
import CoreState from "./CoreState";
import GUIManagger from "../GUIManager";
import LoadingBar from "../LoadingBar";
import {IMapSize} from "../ICom";
import {Vector3} from "three";
import AudioManager from "../AudioManager";

export default class InitState implements IState {
    private share: StateShare;
    private loadCore: boolean;
    private isMapLoaded: boolean;
    private isSocketConnected: boolean;
    private isSoundLoad: boolean;
    private loading: LoadingBar;
    private socket: SocketCom | null;

    constructor(share: StateShare) {
        this.loadCore = false;
        this.isMapLoaded = false;
        this.isSocketConnected = false;
        this.isSoundLoad = false;
        this.share = share;
        this.loading = new LoadingBar();
        this.socket = null;
    }

    private loadMusic() {
        let sounds = [
            AudioManager.getInstance().loadSoundProm("chickenDeath", "sounds/chicken/hurt.ogg"),
            AudioManager.getInstance().loadSoundProm("incantationStart", "sounds/incantation/start.ogg"),
            AudioManager.getInstance().loadSoundProm("incantationFail", "sounds/incantation/fail.ogg"),
            AudioManager.getInstance().loadSoundProm("incantationSuccess", "sounds/incantation/success.ogg"),
            AudioManager.getInstance().loadSoundProm("eggDrop", "sounds/egg/drop.ogg"),
            AudioManager.getInstance().loadSoundProm("eggSpawn", "sounds/egg/spawn.ogg"),
        ];

        Promise.all(sounds)
            .then(() => {
                this.isSoundLoad = true;
            })
            .catch(() => {
                this.loading.setError('Impossible de charger les sons');
            });
    }

    private onData(data: string) {
        if (!this.socket) {
            console.warn("Socket not initialized");
            return;
        }
        if (data === "WELCOME\n") {
            this.loading.setPercentage(10);
            this.socket.send("gui\n");
        } else if (data === "ok\n") {
            this.loading.setPercentage(20);
            this.socket.send(JSON.stringify({command: "map-size"}) + "\n");
        } else {
            this.loading.setPercentage(25);
            let obj: IMapSize;
            try {
                obj = JSON.parse(data);
            } catch (e) {
                console.warn("Invalid response from server: " + data);
                this.loading.setError("Impossible de se connecter au serveur Zappy");
                return;
            }
            if (obj['response-type'] === "map-size") {
                this.share.addKey("mapSize", obj.size);
                this.isSocketConnected = true;
                this.initAssets();
            } else {
                this.loading.setError("Impossible de se connecter au serveur Zappy");
                console.warn("Unknown response from server: " + obj['response-type']);
            }
        }
    }

    private initSocket() {
        let url = new URL(window.location.href);
        this.socket = new SocketCom(parseInt(url.port), url.hostname, () => {
        }, () => {
            this.loading.setError("Impossible de se connecter au serveur Zappy");
        }, (data) => {
            this.onData(data);
        });
        this.share.addKey("socket", this.socket);
    }

    public getTextureSkyBox() {
        let path = "textures/skybox/";
        let format = '.png';
        let urls = [
            path + 'right' + format,
            path + 'left' + format,
            path + 'top' + format,
            path + 'bottom' + format,
            path + 'back' + format,
            path + 'front' + format
        ];
        return urls;
    }

    public initAssets() {
        let scaleDropable = 0.3;

        let loader = [
            this.share.getAssetsPool().loadGlTFProm('map', 'models/map/map.gltf', THREE.FrontSide, (obj) => {
                obj.scene.position.set(0, -3.75, 0);
                this.loading.incPercentage(75 / loader.length);
            }),
            this.share.getAssetsPool().loadGlTFProm('chicken', 'models/chicken/chicken.gltf', THREE.FrontSide, (obj) => {
                obj.scene.scale.set(0.5, 0.5, 0.5);
                this.loading.incPercentage(75 / loader.length);
            }),
            this.share.getAssetsPool().loadCubeTextureProm('skybox', this.getTextureSkyBox(), () => {
                this.loading.incPercentage(75 / loader.length);
            }),
            // this.share.getAssetsPool().loadJson('test', 'models/scene-animation.json', (obj) => {
                // this.loading.incPercentage(75 / loader.length);
            // }),

            this.share.getAssetsPool().loadGlTFProm('egg', 'models/egg/egg.gltf', THREE.FrontSide, (obj) => {
                obj.scene.scale.set(0.5, 0.5, 0.5);
                this.loading.incPercentage(75 / loader.length);
            }),

            // Dropable Models
            this.share.getAssetsPool().loadGlTFProm('diamond', 'models/diamond/diamond.gltf', THREE.DoubleSide, (obj) => {
                obj.scene.scale.set(scaleDropable, scaleDropable, scaleDropable);
                this.loading.incPercentage(75 / loader.length);
            }),
            this.share.getAssetsPool().loadGlTFProm('food', 'models/food/food.gltf', THREE.DoubleSide, (obj) => {
                obj.scene.scale.set(scaleDropable, scaleDropable, scaleDropable);
                this.loading.incPercentage(75 / loader.length);
            }),
            this.share.getAssetsPool().loadGlTFProm('coal', 'models/coal/coal.gltf', THREE.DoubleSide, (obj) => {
                obj.scene.scale.set(scaleDropable, scaleDropable, scaleDropable);
                this.loading.incPercentage(75 / loader.length);
            }),
            this.share.getAssetsPool().loadGlTFProm('emerald', 'models/emerald/emerald.gltf', THREE.DoubleSide, (obj) => {
                obj.scene.scale.set(scaleDropable, scaleDropable, scaleDropable);
                this.loading.incPercentage(75 / loader.length);
            }),
            this.share.getAssetsPool().loadGlTFProm('iron', 'models/iron/iron.gltf', THREE.DoubleSide, (obj) => {
                obj.scene.scale.set(scaleDropable, scaleDropable, scaleDropable);
                this.loading.incPercentage(75 / loader.length);
            }),
            this.share.getAssetsPool().loadGlTFProm('lapis', 'models/lapis/lapis.gltf', THREE.DoubleSide, (obj) => {
                obj.scene.scale.set(scaleDropable, scaleDropable, scaleDropable);
                this.loading.incPercentage(75 / loader.length);
            }),
            this.share.getAssetsPool().loadGlTFProm('gold', 'models/gold/gold.gltf', THREE.DoubleSide, (obj) => {
                obj.scene.scale.set(scaleDropable, scaleDropable, scaleDropable);
                this.loading.incPercentage(75 / loader.length);
            })
        ];

        Promise.all(loader).then(() => {
            this.isMapLoaded = true;
            // this.initSocket();
        }, () => {
            this.loading.setError("Erreur lors du chargement des assets");
        });
    }

    public init() {
        this.loading.show();
        // this.isSocketConnected = true;
        this.initSocket();
        // this.initAssets();

        this.loadMusic();
    }

    public update() {
        if (this.isMapLoaded && this.isSocketConnected && this.isSoundLoad && !this.loadCore) {
            console.log("Loaded");
            this.loading.hide();
            this.loadCore = true;
            (<StateMachine> this.share.getKey("stateMachine")).push(new CoreState(this.share));
        }
    }

    public getName() {
        return "init";
    }
};