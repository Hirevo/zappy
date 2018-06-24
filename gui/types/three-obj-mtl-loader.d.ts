declare module "three-obj-mtl-loader" {
    import {MaterialCreator, Object3D} from "three";

    export class MTLLoader {
        load: (url: string, onLoad?: (material: MaterialCreator) => void, onProgess?: (evt: ProgressEvent) => void, onError?: (error: ErrorEvent) => void) => void;
        setPath: (path: string) => MTLLoader;
        setTexturePath: (path: string) => MTLLoader;
        setBaseUrl: (path: string) => MTLLoader;
    }

    export class OBJLoader {
        setMaterials: (material: MaterialCreator) => OBJLoader;
        setPath: (path: string) => OBJLoader;
        load: (url: string, onLoad?: (object: Object3D) => void, onProgess?: (evt: ProgressEvent) => void, onError?: (err: ErrorEvent) => void) => void;
    }
}