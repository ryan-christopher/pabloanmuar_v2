<script lang="ts">
	import { Canvas } from '@threlte/core';
	import GuitarScene from './GuitarScene.svelte';
</script>

<div class="mx-auto h-[125px] w-[50px] hover:cursor-pointer md:h-[200px] md:w-[175px]">
	<Canvas renderMode="on-demand">
		<GuitarScene />
	</Canvas>
</div>
