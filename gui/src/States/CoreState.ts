import * as THREE from "three";
import IState from "./IState"
import GUIManager from "../GUIManager"
import StateShare from "./StateShare";
import MainScene from "../Scenes/MainScene";
import {Vector3} from "three";

export default class CoreState implements IState {
    private manager: GUIManager;
    private state: StateShare;
    private mainMap: MainScene;
    private camPos: Vector3;

    private eventBinding: {[index: string]: (data: Object) => void };

    private tmp: boolean;
    private inc: number;

    public constructor(state: StateShare) {
        this.mainMap = new MainScene(state);
        this.manager = GUIManager.getInstance();
        this.state = state;
        this.camPos = new Vector3();

        this.inc = 0;
        this.tmp = false;

        this.eventBinding = {};
        this.eventBinding["player-join"] = this.mainMap.playerJoin.bind(this.mainMap);
        this.eventBinding["player-death"] = this.mainMap.playerDeath.bind(this.mainMap);
        this.eventBinding["player-move"] = this.mainMap.playerMove.bind(this.mainMap);
        this.eventBinding["player-turn"] = this.mainMap.playerTurn.bind(this.mainMap);
        this.eventBinding["incantation-start"] = this.mainMap.playerIncantationStart.bind(this.mainMap);
        this.eventBinding["incantation-fail"] = this.mainMap.playerIncantationFail.bind(this.mainMap);
        this.eventBinding["incantation-success"] = this.mainMap.playerIncantationSuccess.bind(this.mainMap);
        this.eventBinding["egg-drop"] = this.mainMap.playerDropEgg.bind(this.mainMap);
        this.eventBinding["egg-hatch"] = this.mainMap.playerHatchEgg.bind(this.mainMap);
    }

    public init() {
        this.mainMap.generate();
        this.camPos = Object.assign({}, this.manager.getCamera().position);
        this.state.getSocket().setOnData(this.onSocketData);

        //TODO rm this
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(-6, 0, -3);
        let cube2 = cube.clone();
        cube2.position.set(-6, 0, 27);
        let cube3 = cube.clone();
        cube3.position.set(28, 0, -3);
        let cube4 = cube.clone();
        cube4.position.set(28, 0, 27);
        GUIManager.getInstance().getScene().add(cube);
        GUIManager.getInstance().getScene().add(cube2);
        GUIManager.getInstance().getScene().add(cube3);
        GUIManager.getInstance().getScene().add(cube4);
    }

    private onSocketData = (data: string) => {
        let resp = data.split('\n');

        resp.forEach((elem) => {
            let json;

            if (!elem.length)
                return;
            console.log(elem);
            try {
                json = JSON.parse(elem);
            } catch (e) {
                console.warn("Unable to parse a response: ", elem, e);
                return;
            }
            if (json.type === "response") {
                if (json['response-type'] === "tile")
                    this.mainMap.setTile(json);
                else if (json['response-type'] === "entities")
                    this.mainMap.initMapTile(json);
            } else if (json.type === "event") {
                if (this.eventBinding[json["event-type"]])
                    this.eventBinding[json["event-type"]](json.data);
            }
        });
    };

    private wait(sleep: number) {
        return new Promise(((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, sleep);
        }));
    }

    public async update() {
        this.mainMap.update();


        //TODO move this in a class
        //TODO change inc by time
        let scale = (2 * Math.PI) / 2000;
        this.inc += 1;
        if (this.inc == 2000)
            this.inc = 0;
        let camPos = Object.assign({}, this.camPos);
        camPos.y += Math.sin(scale * this.inc) * 2;
        this.manager.getCamera().lookAt(10, 0, 15);
        this.manager.getCamera().position.set(camPos.x, camPos.y, camPos.z);

        if (!this.tmp) {
            this.tmp = true;
            this.state.getSocket().sendJSON({"command": "entities"});
            // let sizeMap = this.state.getMapSize();
            // for (let y = 0; y < sizeMap.y; y++)
            //     for (let x = 0; x < sizeMap.x; x++) {
            //         this.state.getSocket().sendJSON({command: "tile", pos: {x: x, y: y}});
            //         await this.wait(10);
            //     }
        }
    }

    public getName() {
        return "core";
    }
}