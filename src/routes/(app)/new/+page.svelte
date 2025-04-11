<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<a href="/" class="mb-2 inline-block hover:underline">&larr; zurück</a>

<h1 class="text-center text-3xl font-bold">Betrittscode erstellen</h1>
<p class="mb-8 text-center">Deine Anmeldung ist 10 Minuten gültig</p>

<p class="mb-2 font-bold">Deine Projekte:</p>
<div class="max-h-64 overflow-auto rounded-lg border *:border-b">
	{#each data.projects as project (project.id)}
		<div class="flex flex-row gap-4 px-2.5 py-3 last:border-none">
			<div class="flex grow flex-col justify-center">
				<p class="font-bold">{project.name}</p>
				<p class="text-[85%]">{project.namespace}</p>
			</div>
			<div class="my-auto">
				<a
					role="button"
					href="/new/{project.id}"
					class="block cursor-pointer rounded-md border border-sky-900 bg-gradient-to-b from-sky-700 to-sky-800 p-3 text-center text-white hover:brightness-90"
					>Erstellen</a
				>
			</div>
		</div>
	{:else}
		<div class="py-3 px-2.5 text-center last:border-none">Du hast keine Projekte</div>
	{/each}
</div>

<p class="mt-4 mb-2 font-bold">Deine Gruppen:</p>
<div class="max-h-64 overflow-auto rounded-lg border *:border-b">
	{#each data.groups as group (group.id)}
		<div class="flex flex-row gap-4 px-2.5 py-3 last:border-none">
			<div class="flex grow flex-col justify-center">
				<p class="font-bold">{group.name}</p>
			</div>
			<div class="my-auto">
				<a
					role="button"
					href="/new/{group.id}?g"
					class="block cursor-pointer rounded-md border border-sky-900 bg-gradient-to-b from-sky-700 to-sky-800 p-3 text-center text-white hover:brightness-90"
					>Erstellen</a
				>
			</div>
		</div>
	{:else}
		<div class="py-3 px-2.5 text-center last:border-none">Du bist in keinen Gruppen</div>
	{/each}
</div>

<small class="mt-2 inline-block"
	><p>
		Hinweis: Es werden nur Einträge gezeigt, bei denen du mindestens die Rolle "Maintainer" hast.
	</p></small
>
