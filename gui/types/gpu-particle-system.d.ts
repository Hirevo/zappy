import { Object3D, BufferGeometry, ShaderMaterial } from "three";

/*
 * GPU Particle System
 * @author flimshaw - Charlie Hoey - http://charliehoey.com
 *
 * A simple to use, general purpose GPU system. Particles are spawn-and-forget with
 * several options available, and do not require monitoring or cleanup after spawning.
 * Because the paths of all particles are completely deterministic once spawned, the scale
 * and direction of time is also variable.
 *
 * Currently uses a static wrapping perlin noise texture for turbulence, and a small png texture for
 * particles, but adding support for a particle texture atlas or changing to a different type of turbulence
 * would be a fairly light day's work.
 *
 * Shader and javascript packing code derrived from several Stack Overflow examples.
 *
 */

declare namespace THREE {
	class GPUParticleSystem extends Object3D {
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


	// Subclass for particle containers, allows for very large arrays to be spread out

	class GPUParticleContainer extends Object3D {
		constructor(maxParticles: number, particleSystem: any);
		PARTICLE_COUNT: number;
		PARTICLE_CURSOR: number;
		time: number;
		offset: number;
		count: number;
		DPR: number;
		GPUParticleSystem: any;
		particleUpdate: boolean;

		// geometry

		particleShaderGeo: BufferGeometry;

		particleShaderMat: any;

		spawnParticle(options: any): void;

		init(): void;

		update(time: any): void;

		geometryUpdate(): void;

		dispose(): void;
	}
}
