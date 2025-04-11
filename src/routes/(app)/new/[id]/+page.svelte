<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let project = $derived(data.project);
</script>

<a href="/new" class="mb-2 inline-block hover:underline">&larr; zurück</a>

<h1 class="text-center text-3xl font-bold">Betrittscode erstellen</h1>
<p class="mb-8 text-center">Deine Anmeldung ist 10 Minuten gültig</p>

<p class="text-lg font-bold">{project.name}</p>
{#if project.namespace !== undefined}
	<p class="text-[90%]">{project.namespace}</p>
{/if}

<form class="mt-3" method="post">
	<input type="hidden" name="isGroup" value={data.isGroup} />

	<label for="access-level" class="text-sm">Rolle</label>
	<select
		id="access-level"
		name="accessLevel"
		class="mb-4 block w-full cursor-pointer rounded-md border border-gray-800 bg-gradient-to-b from-gray-600 to-gray-700 p-3 text-center text-white hover:brightness-90"
	>
		<option value="10">Guest</option>
		<option value="15">Planner</option>
		<option value="20">Reporter</option>
		<option value="30">Developer</option>
		<option value="40">Maintainer</option>
	</select>

	<input
		type="submit"
		class="block w-full cursor-pointer rounded-md border border-sky-900 bg-gradient-to-b from-sky-700 to-sky-800 p-3 text-center text-white hover:brightness-90"
		value="Erstellen"
	/>
</form>
