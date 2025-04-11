<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<h1 class="text-center text-8xl font-extrabold">Moin</h1>
<p class="mb-8 text-center text-xl">du kannst hier entweder...</p>

<p class="mb-2 font-bold">einem Projekt oder einer Gruppe beitreten:</p>

<form class="flex flex-col" method="POST">
	<label for="enter-code" class="text-sm">Beitrittscode</label>
	<input
		type="text"
		id="enter-code"
		name="code"
		required
		minlength="6"
		maxlength="6"
		class="my-0.5 rounded-md border-2 px-2 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-1"
	/>
	{#if form?.error !== undefined}
		<span class="text-sm text-red-800">{form.error}</span>
	{/if}
	<input
		type="submit"
		value="Beitreten"
		class="mt-2 w-full cursor-pointer rounded-md border-[1px] border-sky-900 bg-gradient-to-b from-sky-700 to-sky-800 p-3 text-white hover:brightness-90"
	/>
</form>

<div
	class="my-3 flex gap-2 before:grow before:translate-y-1/2 before:border-t-2 after:grow after:translate-y-1/2 after:border-t-2"
>
	oder
</div>

<p class="mb-2 font-bold">einen neuen Beitrittscode erstellen:</p>

<a
	role="button"
	href="/new"
	class="block cursor-pointer rounded-md border-[1px] border-orange-900 bg-gradient-to-b from-orange-700 to-orange-800 p-3 text-center text-white hover:brightness-90"
	>Projekt oder Gruppe auswählen</a
>
<br />
<small class="text-[85%]">
	<span
		>Info: Diese Seite ist nur für Angehörige der HAW Hamburg gedacht und funktioniert auch nur für
		diese.
	</span>
</small>
