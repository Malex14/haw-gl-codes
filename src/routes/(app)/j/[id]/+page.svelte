<script lang="ts">
	import { page } from '$app/state';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let project = $derived(data.project);
</script>

<h1 class="text-center text-3xl font-bold">{project.name}</h1>
{#if project.namespace !== undefined}
	<p class="mb-8 text-center">{project.namespace}</p>
{/if}

<a
	role="button"
	type="submit"
	href="/j/{page.params.id}/join"
	class="mt-2 block cursor-pointer rounded-md border-[1px] border-sky-900 bg-gradient-to-b from-sky-700 to-sky-800 p-3 text-center text-white hover:brightness-90"
	>Beitreten</a
>
