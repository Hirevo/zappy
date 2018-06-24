import AssetsPool from "../AssetsPool";
import {Object3D, Vector2, Vector3, Clock, Audio} from "three";
import GUIManagger from "../GUIManager";
import AudioManager from "../AudioManager";
// import * as THREE from "three";
// import "../../types/gpu-particle-system.d.ts";
import "gpu-particle";

/// <reference path="../../types/gpu-particle-system.d.ts" />

let options = {
    position: new Vector3(),
    positionRandomness: 2,
    velocity: new Vector3(),
    velocityRandomness: 2,
    color: 0xaa88ff,
    colorRandomness: .2,
    turbulence: 0,
    lifetime: 0.5,
    size: 2,
    sizeRandomness: 0.5
};

export default class Player {
    private object: Object3D;
    private dest: Vector3;
    private speedX: number;
    private speedZ: number;
    private destRot: Vector3;
    private speedRot: number;
    private timeInterval: any;
    private timeIntervalRot: any;

    private particleInterval: any;
    private clock: Clock;
    private particle: THREE.GPUParticleSystem;
    private inc: number;
    private particleEnable: boolean;
    private incantationSound: Audio | undefined;

    constructor(assetPool: AssetsPool, position: Vector2 = new Vector2(0, 0)) {
        if (!assetPool.getGltfAssets("chicken")) {
            alert("Missing models: Chicken");
            window.location.href = "/";
        }

        this.timeInterval = null;
        this.timeIntervalRot = null;
        this.speedX = 0;
        this.speedZ = 0;
        this.speedRot = 0;
        this.object = assetPool.getGltfAssets("chicken").scene.clone();
        this.dest = new Vector3(position.x, 0, position.y);
        this.destRot = new Vector3(position.x, 0, position.y);
        this.object.position.set(position.x, 0, position.y);
        GUIManagger.getInstance().getScene().add(this.object);

        this.incantationSound = undefined;
        this.setIncantationSound();


        // HERE IS HOW ANIMATE A JSON ASSET

        // let object = assetPool.getJsonAssets("test").clone();
        // object.position.set(position.x, 0, position.y);
        // object.scale.set(0.1, 0.1, 0.1)
        // let mixer = new THREE.AnimationMixer(object);
        // if (object.geometry instanceof THREE.Geometry)
        //     mixer.clipAction(object.geometry.animations[0]).setDuration(1).play();
        // GUIManagger.getInstance().getMixers().push(mixer);
        // GUIManagger.getInstance().getMixers().pop();
        // GUIManagger.getInstance().getScene().add(object);
        // GUIManagger.getInstance().getScene().remove(object);
        // object.remove();

        this.particle = new THREE.GPUParticleSystem({
            maxParticles: 250000
        });
        this.particleEnable = false;
        this.inc = 0;
        this.clock = new Clock();
        GUIManagger.getInstance().getScene().add((this.particle as any));
        this.particleInterval = setInterval(this.emitParticle, 25);
    }

    private setIncantationSound() {
        let audio = AudioManager.getInstance().getSound("incantationStart");

        if (audio)
            this.incantationSound = audio;
    }

    private emitParticle = () => {
        this.inc += this.clock.getDelta();
        if (this.particleEnable) {
            options.position = this.object.position;
            for (let i = 0; i < 8000; i++) {
                this.particle.spawnParticle(options);
            }
        }
        this.particle.update(this.inc);
    };

    public setPosition(pos: Vector3) {
        let count = 5;
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
        this.dest = pos;
        this.speedX = Math.abs(pos.x - this.object.position.x) / count;
        this.speedZ = Math.abs(pos.z - this.object.position.z) / count;
        this.timeInterval = setInterval(() => {
            count--;
            if (!count && this.timeInterval) {
                clearInterval(this.timeInterval);
                this.timeInterval = null;
            }
            let newX = this.object.position.x;
            let newZ = this.object.position.z;
            if (this.dest.x > this.object.position.x)
                newX += this.speedX;
            else if (this.dest.x < this.object.position.x)
                newX -= this.speedX;
            if (this.dest.z > this.object.position.z)
                newZ += this.speedZ;
            else if (this.dest.z < this.object.position.z)
                newZ -= this.speedZ;
            this.object.position.set(newX, this.dest.y, newZ);
        }, 25);
    }

    public setRotation(rotation: Vector3) {
        let count = 5;
        if (this.timeIntervalRot) {
            clearInterval(this.timeIntervalRot);
            this.timeIntervalRot = null;
        }
        this.destRot = rotation
        this.speedRot = Math.abs(rotation.y - this.object.rotation.y) / count;
        this.timeIntervalRot = setInterval(() => {
            count--;
            if (!count && this.timeIntervalRot) {
                clearInterval(this.timeIntervalRot);
                this.timeIntervalRot = null;
            }
            let newRot = this.object.rotation.y;
            if (this.destRot.y > this.object.rotation.y)
                newRot += this.speedRot;
            else if (this.destRot.y < this.object.rotation.y)
                newRot -= this.speedRot;
            this.object.rotation.set(this.destRot.x, newRot, this.destRot.z);
        }, 25, 0);
    }

    public remove() {
        GUIManagger.getInstance().getScene().remove(this.object);
        let audio = AudioManager.getInstance().getSound("chickenDeath");
        if (this.particleInterval)
            clearInterval(this.particleInterval);
        if (audio)
            audio.play();
        if (this.incantationSound && this.incantationSound.isPlaying)
            this.incantationSound.stop();
        let frame = this.inc;
        let tmpInterval = setInterval(() => {
            this.inc += this.clock.getDelta();
            this.particle.update(this.inc);
            if (this.inc - frame >= 1) {
                GUIManagger.getInstance().getScene().remove((this.particle as any));
                clearInterval(tmpInterval);
            }
        }, 10);
    }

    public setParticle(state: boolean) {
        this.particleEnable = state;
        if (state && this.incantationSound) {
            this.incantationSound.setLoop(true);
            this.incantationSound.play();
        } else if (this.incantationSound && this.incantationSound.isPlaying) {
            this.incantationSound.stop();
        }
    }
}