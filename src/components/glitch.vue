<template>
	<div>

	</div>
</template>
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
		};
	},
	mounted() {
		this.init();
		this.animate();
	},
	methods: {
		init() {
			this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
			this.camera.position.y = 150;
			this.camera.position.z = 500;

			this.scene = new THREE.Scene();

			const light = new THREE.PointLight(0xffffff);
			light.position.set(500, 500, 500);
			this.scene.add(light);

			const lightTwo = new THREE.PointLight(0xffffff, 0.25);
			lightTwo.position.set(-500, -500, -500);
			this.scene.add(lightTwo);

			this.sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(200, 20, 10), new THREE.MeshPhongMaterial({ flatShading: true }));
			this.scene.add(this.sphere);

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

			this.starField = new THREE.Points(starsGeometry, starsMaterial);

			this.scene.add(this.starField);

			this.addLogoSvgs();

			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setSize(window.innerWidth, window.innerHeight);

			this.effect = new AsciiEffect(this.renderer, ' .:-+*=%@#', { invert: true });
			this.effect.setSize(window.innerWidth, window.innerHeight);
			this.effect.domElement.style.color = 'white';
			this.effect.domElement.style.backgroundColor = 'black';

			// Special case: append effect.domElement, instead of renderer.domElement.
			// AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

			document.body.appendChild(this.effect.domElement);

			this.controls = new OrbitControls(this.camera, this.effect.domElement);
			this.controls.maxDistance = 200;
			this.controls.maxAzimuthAngle = Math.PI / 6;
			this.controls.minAzimuthAngle = -Math.PI / 6;
			this.controls.maxPolarAngle = Math.PI / 2;
			this.controls.minPolarAngle = Math.PI / 2;
			this.controls.maxZoom = 100;
			//

			window.addEventListener('resize', this.onWindowResize, false);
		},
		onWindowResize() {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();

			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.effect.setSize(window.innerWidth, window.innerHeight);
		},
		animate() {
			requestAnimationFrame(this.animate);
			this.starField.rotation.z += 0.005;
			this.render();
		},
		render() {
			const timer = Date.now() - this.start;

			this.sphere.position.y = Math.abs(Math.sin(timer * 0.002)) * 150;
			this.sphere.rotation.x = timer * 0.0003;
			this.sphere.rotation.z = timer * 0.0002;

			this.controls.update();

			this.effect.render(this.scene, this.camera);
		},
		addLogoSvgs() {
			this.addTextures(logoE, 'e');
			this.addTextures(logoX, 'x');
			this.addTextures(logoA, 'a');
			this.loadTextures().then(() => {
				console.log(logoX, 'hello!!!');
				const geometry = new THREE.PlaneGeometry(100, 100);
				const eMaterial = new THREE.MeshBasicMaterial({ map: this.textures.loaded.e });
				eMaterial.side = THREE.DoubleSide;
				const eCharacter = new THREE.Mesh(geometry, eMaterial);
				eCharacter.position.x = -120;

				const xMaterial = new THREE.MeshBasicMaterial({ map: this.textures.loaded.x });
				xMaterial.side = THREE.DoubleSide;
				const xCharacter = new THREE.Mesh(geometry, xMaterial);
				xCharacter.position.x = 0;

				const aMaterial = new THREE.MeshBasicMaterial({ map: this.textures.loaded.a });
				aMaterial.side = THREE.DoubleSide;
				const aCharacter = new THREE.Mesh(geometry, aMaterial);
				aCharacter.position.x = 120;
				this.scene.add(eCharacter);
				this.scene.add(xCharacter);
				this.scene.add(aCharacter);
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
