<template>
	<div ref="map">

	</div>
</template>
<style lang="scss" scoped>
  div {
	width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
  }
</style>
<script lang="ts">
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { AsciiEffect } from '../assets/js/effects/AsciiEffect';
import logoE from '@/assets/svg/e.svg';
import logoX from '@/assets/svg/x.svg';
import logoA from '@/assets/svg/a.svg';

export default {
	data() {
		return {
			camera: {},
			controls: {},
			container: {},
			containerSize: {},
			scene: {},
			renderer: {},
			effect: {},
			starField: {},
			sphere: {},
			plane: {},
			textures: {
				files: [],
				loaded: {},
			},
			Loader: {},
			DPR: {},
			maxDistance: {},
			FOV: {},
			logoGroup: {}
		};
	},
	mounted() {
		this.container = this.$refs.map;
		this.containerSize = this.container.getBoundingClientRect();
		this.maxDistance = this.containerSize.width;
		this.FOV = 2 * Math.atan( this.containerSize.height / ( 2 * this.maxDistance ) ) * 180 / Math.PI;
		this.DPR = window.devicePixelRatio;
		this.init();
		this.animate();
	},
	methods: {
		init() {
			var distance = this.maxDistance * 1.25;
			var diag = Math.sqrt((this.containerSize.height * this.containerSize.height)+(this.containerSize.width*this.containerSize.width))
			this.FOV = 2 * Math.atan( diag / ( 2 * this.maxDistance ) ) * 180 / Math.PI;
			this.camera = new THREE.PerspectiveCamera( this.FOV, this.containerSize.width/this.containerSize.height, 0.1, this.maxDistance * 1.25);
			this.camera.position.z = distance;

			this.scene = new THREE.Scene();

			const light = new THREE.PointLight(0xffffff);
			light.position.set(500, 500, 500);
			this.scene.add(light);

			const lightTwo = new THREE.PointLight(0xffffff, 0.25);
			lightTwo.position.set(-500, -500, -500);
			this.scene.add(lightTwo);

			// This.plane

			/* this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight), new THREE.MeshBasicMaterial({ color: 'red' }));
			this.scene.add(this.plane); */

			const starsGeometry = new THREE.Geometry();

			// eslint-disable-next-line no-plusplus
			for (let i = 0; i < 10000; i++) {
				const star = new THREE.Vector3();
				star.x = THREE.Math.randFloatSpread(2000);
				star.y = THREE.Math.randFloatSpread(2000);
				star.z = THREE.Math.randFloatSpread(10);

				starsGeometry.vertices.push(star);
			}

			const starsMaterial = new THREE.PointsMaterial({ color: 0x888888 });

			this.starField = new THREE.Mesh(new THREE.SphereBufferGeometry(this.containerSize.width, 20, 10), new THREE.MeshPhongMaterial({ flatShading: true,side: THREE.BackSide, color: 'blue' }));

			this.scene.add(this.starField);

			this.addLogoSvgs();

			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.setPixelRatio(this.DPR);

			this.effect = new AsciiEffect(this.renderer, ' .:-+*=%@#', { invert: true, alpha: true });
			this.effect.setSize(window.innerWidth, window.innerHeight);
			this.effect.domElement.style.color = 'white';
			this.effect.domElement.style.backgroundColor = 'black';

			// Special case: append effect.domElement, instead of renderer.domElement.
			// AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

			this.container.appendChild(this.effect.domElement);

			this.controls = new OrbitControls(this.camera, this.effect.domElement);
			this.controls.maxDistance = 300;
			this.controls.enablePan = false;
			this.controls.maxAzimuthAngle = Math.PI / 6;
			this.controls.minAzimuthAngle = -Math.PI / 6;
			this.controls.maxPolarAngle = 2;
			this.controls.minPolarAngle = 1;
			this.controls.maxZoom = -500;
			this.autoRotate = true;
			this.controls.update();
			//

			window.addEventListener('resize', this.onWindowResize, false);
		},
		onWindowResize() {
			this.containerSize = this.container.getBoundingClientRect();
			const { width, height } = this.containerSize;
			this.camera.aspect = width / height;
			var distance = this.maxDistance;
			var diag = Math.sqrt((this.containerSize.height * this.containerSize.height)+(this.containerSize.width*this.containerSize.width))
			this.FOV = 2 * Math.atan( diag / ( 2 * distance ) ) * 180 / Math.PI;
			this.camera.setFocalLength(this.FOV);
			this.camera.updateProjectionMatrix();

			this.renderer.setSize(width, height);
			this.effect.setSize(width, height);
		},
		animate() {
			requestAnimationFrame(this.animate);
			
			this.controls.update();
			const timer = Date.now() - this.start;

			this.render();
		},
		render() {
			this.effect.render(this.scene, this.camera);
		},
		
		addLogoSvgs() {
			this.addTextures(logoE, 'e');
			this.addTextures(logoX, 'x');
			this.addTextures(logoA, 'a');
			this.loadTextures().then(() => {
				const totalWidth = this.containerSize.width * 0.75;
				const letterPercentage = 0.29411764705882355;
				const letterSize = totalWidth * letterPercentage;
				const marginPercentage = 0.0588235294117647;
				const marginSize = totalWidth * marginPercentage;
				console.log(letterSize, marginSize);
				const geometry = new THREE.PlaneGeometry(letterSize, letterSize);
				const eMaterial = new THREE.MeshBasicMaterial({ map: this.textures.loaded.e });
				eMaterial.side = THREE.DoubleSide;
				const eCharacter = new THREE.Mesh(geometry, eMaterial);
				eCharacter.position.x = -letterSize - marginSize;

				const xMaterial = new THREE.MeshBasicMaterial({ map: this.textures.loaded.x });
				xMaterial.side = THREE.DoubleSide;
				const xCharacter = new THREE.Mesh(geometry, xMaterial);
				xCharacter.position.x = 0;

				const aMaterial = new THREE.MeshBasicMaterial({ map: this.textures.loaded.a });
				aMaterial.side = THREE.DoubleSide;
				const aCharacter = new THREE.Mesh(geometry, aMaterial);
				aCharacter.position.x = letterSize + marginSize;
				this.logoGroup = new THREE.Object3D();
				this.logoGroup.add();
				this.logoGroup.add(eCharacter);
				this.logoGroup.add(xCharacter);
				this.logoGroup.add(aCharacter);
				this.logoGroup.position.z = -(this.maxDistance * 0.125);
				this.scene.add(this.logoGroup);
			});
		},
		addTextures(path, id) {
			this.Loader = new THREE.TextureLoader();
			this.Loader.crossOrigin = '';
			this.textures.files.push(new Promise((resolve, reject) => {
				this.Loader.load(path, (textureParam) => {
					const texture = textureParam;
					texture.minFilter = THREE.LinearFilter;
					this.textures.loaded[id] = texture;

					resolve();
				}, (xhr) => {
					console.log(`${xhr.loaded / xhr.total * 100}% loaded`);
				}, (xhr) => {
					console.log('Failed to locate resource', xhr);
					reject();
				});
			}));
		},
		loadTextures() {
			return Promise.all(this.textures.files);
		},
	},
};
</script>
