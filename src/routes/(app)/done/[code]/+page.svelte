<script lang="ts">
	import { page } from '$app/state';
	import QRCode from 'qrcode';
</script>

<a href="/new" class="mb-2 inline-block hover:underline">&larr; zurück</a>

<h1 class="mb-8 text-center text-3xl font-bold">Betrittscode erstellt</h1>

<p class="mb-1">Dein Betrittscode lautet:</p>

<p class="text-center text-2xl font-bold">{page.params.code}</p>

<p class="mt-2">Alternativ kannst du auch diesen Link nutzen:</p>

<div class="text-center">
	<a class="font-bold underline" href="https://gl.mbehrmann.de/j/{page.params.code}"
		>https://gl.mbehrmann.de/j/{page.params.code}</a
	>
</div>

<div class="mt-4 flex justify-center">
	{#await QRCode.toDataURL('https://gl.mbehrmann.de/j/' + page.params.code, { scale: 1 })}
		<div class="aspect-square w-3/4"></div>
	{:then url}
		<img class="w-3/4 [image-rendering:pixelated]" alt="QRCode vom Link oben" src={url} />
	{/await}
</div>
