import AssetsPool from "../AssetsPool";
import SocketCom from "../SocketCom";
import {Vector2} from "three";

interface Value {
    [name: string]: any
}

export default class StateShare {
    private values: Value;

    constructor() {
        this.values = {};
    }

    addKey(name: string, val: any) {
        this.values[name] = val;
    }

    delKey(name: string) {
        this.values[name] = undefined;
    }

    getKey(name: string): any {
        return this.values[name];
    }

    getSocket() : SocketCom {
        return this.values["socket"];
    }

    getAssetsPool() : AssetsPool {
        return this.values["assetsPool"];
    }

    getMapSize() : Vector2 {
        let vect = new Vector2();

        vect.x = this.values["mapSize"].width;
        vect.y = this.values["mapSize"].height;
        return vect;
    }
}