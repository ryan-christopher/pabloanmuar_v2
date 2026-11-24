<script lang="ts">
	import { T, useLoader } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

	const guitar = useLoader(FBXLoader).load('/guitar/guitar.fbx');
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75}>
	<OrbitControls
		autoRotate
		autoRotateSpeed={5.0}
		enableZoom={false}
		enablePan={false}
		minPolarAngle={Math.PI / 2}
		maxPolarAngle={Math.PI / 2}
	/>
</T.PerspectiveCamera>

<T.AmbientLight intensity={1.5} />

{#if $guitar}
	<T
		is={$guitar}
		position={[0.3, -2.5, 0]}
		rotation={[0.25, 0, 0.14]}
		scale={0.006}
	/>
{/if}
