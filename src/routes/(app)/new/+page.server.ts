import type { PageServerLoad } from './$types';
import { Action, authCodeFlow } from '$lib/server/oidc';
import { decryptCookie } from '$lib/server/crypto';
import { getProjects } from '$lib/server/gitlab';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const authCookie = cookies.get('auth');
	if (authCookie === undefined) {
		return await authCodeFlow(cookies, 'openid api', Action.NEW);
	}

	let bearer_token!: string;
	try {
		const { b } = JSON.parse(decryptCookie(authCookie));
		bearer_token = b;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_error) {
		cookies.delete('auth', { path: '/' });
		redirect(302, '/');
	}

	try {
		const projects = await getProjects(false, bearer_token);
		const groups = await getProjects(true, bearer_token);

		return {
			projects,
			groups,
		};
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		cookies.delete('auth', { path: '/' });
		return await authCodeFlow(cookies, 'openid api', Action.NEW);
	}
};
