import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { decryptCookie } from '$lib/server/crypto';
import { createAccessToken, getProject } from '$lib/server/gitlab';
import { insertProject } from '$lib/server/db';
import { AccessLevel } from '$lib/types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
	const authCookie = cookies.get('auth');
	if (authCookie === undefined) {
		redirect(302, '/');
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

	const id = params.id;
	const isGroup = url.searchParams.has('g');

	const glProject = await getProject(id, isGroup, bearer_token, true);

	return {
		project: {
			id: glProject.id,
			name: glProject.name,
			web_url: glProject.web_url,
			star_count: glProject.star_count,
			namespace: glProject.namespace?.name,
		},
		isGroup,
	};
};

export const actions = {
	default: async ({ request, cookies, locals, params }) => {
		const authCookie = cookies.get('auth');
		if (authCookie === undefined) {
			error(401);
		}
		let bearer_token!: string;
		let user_id!: string;
		try {
			const { b, i } = JSON.parse(decryptCookie(authCookie));
			bearer_token = b;
			user_id = i;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_error) {
			cookies.delete('auth', { path: '/' });
			error(401);
		}

		const db = locals.db;

		const data = await request.formData();

		const id = params.id;
		const isGroup = data.get('isGroup') === 'true';
		const accessLevel = data.get('accessLevel');
		if (id === undefined || accessLevel === null) {
			error(400);
		}
		const accessLevelNumber = Number.parseInt(accessLevel.toString());

		const code = generateCode();
		const token = await createAccessToken(id, isGroup, AccessLevel.MAINTAINER, bearer_token, code);
		await insertProject(db, id, isGroup, code, token, accessLevelNumber, user_id);

		redirect(302, '/done/' + code);
	},
} satisfies Actions;

function generateCode(): string {
	const characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnopqrstuvwxyz';
	let code = '';

	for (let i = 0; i < 6; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		code += characters[randomIndex];
	}

	return code;
}
