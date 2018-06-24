import * as THREE from "three"
import * as path from "path"
import GLTFLoader, {GLTF, GLTFLoaderlol} from "three-gltf-loader";
// import {Group} from "three"
import "obj-loader";
import "mtl-loader";
import "gltf-loader";
import "draco-loader";
import {CubeTexture, MaterialCreator, Side, Vector3, Object3D} from "three";


interface IAssets {
    [key: string]: any;
}

export default class AssetsPool {
    private assets: IAssets;

    constructor() {
        this.assets = {};
    }

    public loadGlTFProm(key: string, pathGlTF: string, backface: Side, onLoad?: (obj: GLTF) => void, onProgress?: (evt: ProgressEvent) => void, onError?: (err: ErrorEvent) => void) {
        return new Promise((resolve, reject) => {
            this.loadGlTF(key, pathGlTF, backface, (obj) => {
                if (onLoad)
                    onLoad(obj);
                resolve();
            }, onProgress, (err) => {
                if (onError)
                    onError(err);
                reject();
            });
        })
    }

    public loadGlTF(key: string, pathGlTF: string, backface: Side, onLoad?: (obj: GLTF) => void, onProgress?: (evt: ProgressEvent) => void, onError?: (err: ErrorEvent) => void) {
        let gltfloader = (new (THREE as any).GLTFLoader() as GLTFLoaderlol);
        gltfloader.load(pathGlTF, (gltf) => {
            if (onLoad)
                onLoad(gltf);
            this.assets[key] = gltf;
            gltf.scene.traverse((node) => {
                if ((node as any).isMesh) {
                    (node as any).material.side = backface;
                }
            });
        }, onProgress, onError);
    }

    public loadCubeTextureProm(key: string, urls: Array<string>, onLoad?: (obj: CubeTexture) => void, onProgress?: (evt: ProgressEvent) => void, onError?: (err: ErrorEvent) => void) {
        return new Promise((resolve, reject) => {
            this.loadCubeTexture(key, urls, (obj) => {
                if (onLoad)
                    onLoad(obj);
                resolve();
            }, onProgress, (err) => {
                if (onError)
                    onError(err);
                reject();
            });
        })
    }

    public loadCubeTexture(key: string, urls: Array<string>, onLoad?: (obj: CubeTexture) => void, onProgress?: (evt: ProgressEvent) => void, onError?: (err: ErrorEvent) => void) {
        let cube = new THREE.CubeTextureLoader();
        cube.load(urls, (text) => {
            if (onLoad)
                onLoad(text);
            this.assets[key] = text;
        }, onProgress, onError);
    }

    public loadJson(key: string, path: string, onLoad?: (obj: THREE.Mesh) => void, onProgress?: (evt: ProgressEvent) => void, onError?: (err: ErrorEvent | Error) => void) {
        let objectLoader = new THREE.JSONLoader();
        objectLoader.load(path, (geometry: THREE.Geometry) => {
            var material = new THREE.MeshPhongMaterial( {
                color: 0xffffff,
                morphTargets: true,
                vertexColors: THREE.FaceColors,
                flatShading: true
            } );
            var mesh = new THREE.Mesh(geometry, material);
            if (onLoad)
                onLoad(mesh);
            this.assets[key] = mesh;
        }, onProgress, onError);
    }

    public loadAssets(key: string, pathObj: string, pathMat: string, onProgress?: (evt: ProgressEvent) => void, onFinish?: (obj: THREE.Group) => void, onError?: (evt: ErrorEvent) => void) {
        let mtlload = new THREE.MTLLoader();
        mtlload.setPath(path.dirname(pathMat) + '/');
        mtlload.load(path.basename(pathMat), (materials) => {
            materials.preload();

            let objload = new THREE.OBJLoader();
            objload.setMaterials(materials);
            objload.setPath(path.dirname(pathObj) + '/');
            objload.load(path.basename(pathObj), (object) => {
                this.assets[key] = object;
                if (onFinish)
                    onFinish(object);
            }, onProgress, onError);

        });
    }

    public getJsonAssets(key: string): THREE.Mesh {
        return this.assets[key];
    }

    public getAssets(key: string): THREE.Object3D {
        return this.assets[key];
    }

    public getGltfAssets(key: string): GLTF {
        return this.assets[key];
    }

    public getCubeTexture(key: string): CubeTexture {
        return this.assets[key];
    }

    public unloadAssets(key: string) {
        delete this.assets[key];
    }
}