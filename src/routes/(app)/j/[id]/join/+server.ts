import type { RequestHandler } from './$types';
import { Action, authCodeFlow } from '$lib/server/oidc';

export const GET: RequestHandler = async ({ cookies, params }) => {
	cookies.set('code', params.id, {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		secure: true,
		maxAge: 180, // seconds
	});

	return await authCodeFlow(cookies, 'openid', Action.JOIN);
};
