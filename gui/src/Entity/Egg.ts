import AssetsPool from "../AssetsPool";
import {Object3D, Vector3} from "three";
import GUIManagger from "../GUIManager";
import AudioManager from "../AudioManager";

export default class Egg {
    private object: Object3D;

    constructor(assetsPool: AssetsPool, position: Vector3 = new Vector3(0, 0, 0)) {
        this.object = assetsPool.getGltfAssets("egg").scene.clone();
        let audio = AudioManager.getInstance().getSound("eggDrop");
        if (audio)
            audio.play();
        if (this.object) {
            this.object.rotation.set(0, -Math.PI / 2, 0);
            this.object.position.set(position.x, position.y, position.z);
            GUIManagger.getInstance().getScene().add(this.object);
        }
    }

    public remove() {
        GUIManagger.getInstance().getScene().remove(this.object);
        let audio = AudioManager.getInstance().getSound("eggSpawn");
        if (audio)
            audio.play();
    }
}