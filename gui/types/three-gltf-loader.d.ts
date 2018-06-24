declare module "three-gltf-loader" {
    import * as THREE from "three";
    // namespace THREE {
        interface GLTF {
            scene: THREE.Scene,
            scenes: Array<THREE.Scene>,
            cameras: Array<THREE.Camera>,
            animations: Array<THREE.AnimationClip>,
            asset: Object
        }

        export class GLTFLoaderlol {
            load: (url: string, onLoad?: (gltf: GLTF) => void, onProgess?: (evt: ProgressEvent) => void, onError?: (error: ErrorEvent) => void) => void;
            setPath: (path: string) => GLTFLoaderlol;
            setTexturePath: (path: string) => GLTFLoaderlol;
            setBaseUrl: (path: string) => GLTFLoaderlol;
        }
    // }
}