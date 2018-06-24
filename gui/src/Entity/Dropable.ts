import AssetsPool from "../AssetsPool";
import {Object3D, Vector3} from "three";
import GUIManagger from "../GUIManager";

export default class Dropable {
    private object: Object3D;
    private startPos: Vector3;
    private factor: number;
    private frame: number;

    public constructor(assetPool: AssetsPool, type: string, position: Vector3 = new Vector3(0, 1, 0), rotation: Vector3 = new Vector3(0, Math.PI / 2, 0)) {
        this.object = assetPool.getGltfAssets(type).scene.clone();
        this.object.position.add(position);
        this.object.rotation.setFromVector3(rotation);
        GUIManagger.getInstance().getScene().add(this.object);
        this.factor = (2 * Math.PI) / 600;
        this.frame = 0;
        this.startPos = Object.assign({}, this.object.position);

        setInterval(this.update, 25);
    }

    public setPosition(position: Vector3) {
        this.object.position.set(position.x, position.y, position.z);
    }

    public setRotation(position: Vector3) {
        this.object.rotation.setFromVector3(position);
    }

    public getPosition() : Vector3 {
        return this.object.position;
    }

    public getRotation() : Vector3 {
        return this.object.rotation.toVector3();
    }

    public update = () => {
        let position = Object.assign({}, this.object.position);
        let rotation = this.object.rotation.toVector3();

        // this.object.rotation.set(0, rotation.y - 0.01, 0);
        // position.y = this.startPos.y + (Math.sin(this.factor * this.frame) / 2);
        // this.object.position.set(position.x, position.y, position.z);
        this.frame += 1;
    };
}