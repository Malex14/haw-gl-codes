<script lang="ts">
	import '$assets/inter.css';
	import '../app.css';

	import { page } from '$app/state';
</script>

<div class="flex h-screen items-center justify-center">
	<div class="flex max-w-[25rem] items-center p-4">
		<h1 class="text-5xl font-bold">{page.status}</h1>
		<div class="mx-2 h-14 border border-gray-500"></div>
		<p class="max-w-72 break-words">{page.error?.message ?? ''}</p>
	</div>
</div>
