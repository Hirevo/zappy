import * as THREE from "three";
import GUIManagger from "./GUIManager";

export default class AudioManager {
    private static _instance: AudioManager;
    private soundList: {[index: string]: THREE.AudioBuffer};

    private constructor() {
        this.soundList = {};
    }

    public static getInstance() : AudioManager {
        return this._instance || (this._instance = new this());
    }

    public loadSoundProm(key: string, path: string, onProgress?: (evt: ProgressEvent) => void) {
        return new Promise((resolve, reject) => {
           this.loadSound(key, path, (audio) => {
               resolve(audio);
           }, onProgress, (err) => {
               reject(err);
           });
        });
    }

    public loadSound(key: string, path: string, onLoad?: (audio: THREE.AudioBuffer) => void, onProgress?: (evt: ProgressEvent) => void, onError?: (err: Error) => void) {
        let audioLoader = new THREE.AudioLoader();
        audioLoader.load(path, (buffer: THREE.AudioBuffer) => {
            this.soundList[key] = buffer;
            if (onLoad)
                onLoad(buffer);
        }, (evt: ProgressEvent) => {
            if (onProgress)
                onProgress(evt);
        }, (err: Error) => {
            if (onError)
                onError(err);
        });
    }

    public getSound(key: string): THREE.Audio | undefined {
        let sound = new THREE.Audio(GUIManagger.getInstance().getAudio());
        if (this.soundList[key])
            return sound.setBuffer(this.soundList[key]);
    }

}