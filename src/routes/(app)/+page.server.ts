import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { linkExists } from '$lib/server/db';

export const actions = {
	default: async ({ request, locals }) => {
		const db = locals.db;

		const data = await request.formData();
		const code = data.get('code')?.toString();

		if (code === undefined || code.length !== 6) {
			return {
				error: 'Ungültiger Code',
			};
		}

		if (!(await linkExists(db, code))) {
			return {
				error: 'Dieser Code existiert nicht',
			};
		}

		redirect(302, '/j/' + code + '/join');
	},
} satisfies Actions;
