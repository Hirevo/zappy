// export class GPUParticleSystem {
//     constructor(obj: Object);
//     public spawnParticle(opt: Object): void;
// }
//
// export as namespace THREE;


declare namespace THREE {
    import {Object3D, ShaderMaterial} from "three";
    export class GPUParticleSystem extends Object3D {
        constructor(options: any);

        PARTICLE_COUNT: number;
        PARTICLE_CONTAINERS: number;

        PARTICLE_NOISE_TEXTURE: any;
        PARTICLE_SPRITE_TEXTURE: any;

        PARTICLES_PER_CONTAINER: number;
        PARTICLE_CURSOR: number;
        time: number;
        particleContainers: any[];
        rand: any[];

        random(): any;

        particleNoiseTex: any;

        particleSpriteTex: any;

        particleShaderMat: ShaderMaterial;

        init(): void;

        spawnParticle(options: any): void;

        update(time: any): void;

        dispose(): void;
    }
}