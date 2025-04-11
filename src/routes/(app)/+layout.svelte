<script lang="ts">
	import '$assets/inter.css';
	import '../../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>HAW Gitlab Beitrittscodes</title>
</svelte:head>

<div class="flex h-screen flex-col">
	<div class="flex grow items-center justify-center">
		<div class="max-w-[28rem] rounded-4xl bg-gray-200 p-10 shadow-xl">
			{@render children()}
		</div>
	</div>
	<div class="mx-auto mt-6 mb-2">
		<div>
			<a class="underline" href="/uebersicht">Wie funktioniert das Ganze hier?</a> &ndash;
			<a
				class="underline"
				href="https://github.com/Malex14/haw-gl-codes"
				rel="noreferer noopener nofollower"
				target="_blank">GitHub</a
			>
		</div>
	</div>
</div>
