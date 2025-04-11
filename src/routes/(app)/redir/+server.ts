import type { RequestHandler } from './$types';
import * as client from 'openid-client';
import { Action, getConfig, verifyToken } from '$lib/server/oidc';
import { error, redirect, type Cookies } from '@sveltejs/kit';
import { getProject as getDbProject } from '$lib/server/db';
import { addMember, getProject as getGlProject } from '$lib/server/gitlab';
import sqlite from 'sqlite3';
import { encryptCookie } from '$lib/server/crypto';

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	const db = locals.db;
	const config = await getConfig();
	const nonce = cookies.get('nonce');

	if (nonce === undefined) {
		error(400, 'Die Autorisierung hat zu lange gedauert. Bitte versuche es erneut.');
	}
	cookies.delete('nonce', { path: '/' });

	const tokens = await client.authorizationCodeGrant(config, url, {
		expectedState: nonce,
	});

	if (tokens.id_token === undefined) {
		console.error('No id token returned from AS');
		error(500, 'Es ist ein interner Fehler aufgetreten. Bitte versuche es erneut.');
	}
	const token = tokens.id_token;

	let decodedToken;
	try {
		decodedToken = await verifyToken(token);
	} catch (e) {
		console.error('Invalid id token received from AS: %j', e);
		error(500, 'Es ist ein interner Fehler aufgetreten. Bitte versuche es erneut.');
	}

	if (typeof decodedToken !== 'object') {
		console.error('Invalid id token received from AS: %j', decodedToken);
		error(500, 'Es ist ein interner Fehler aufgetreten. Bitte versuche es erneut.');
	}

	const userId = decodedToken.sub;
	if (userId === undefined) {
		console.error('Id token has no sub field');
		error(500, 'Es ist ein interner Fehler aufgetreten. Bitte versuche es erneut.');
	}

	const action = nonce.substring(0, nonce.indexOf('-'));
	switch (action) {
		case Action.JOIN:
			return await doJoin(userId, cookies, db);
		case Action.NEW:
			return await doNew(tokens.access_token, userId, cookies);
		default:
			error(400, 'Ungültige Anfrage. Bitte versuche es erneut.');
	}
};

async function doJoin(userId: string, cookies: Cookies, db: sqlite.Database): Promise<never> {
	const code = cookies.get('code');
	cookies.delete('code', { path: '/' });
	if (code === undefined) {
		error(400, 'Dein Betrittscode kann nicht gefunden werden. Bitte versuche es erneut.');
	}

	const dbProject = await getDbProject(db, code);
	if (dbProject === undefined) {
		error(400, 'Dein Beitrittscode ist ungültig. Bitte versuche es erneut.');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let glProject!: any;
	try {
		glProject = await getGlProject(dbProject.project_id, dbProject.is_group, dbProject.token);
		await addMember(dbProject.project_id, dbProject.is_group, userId, 20, dbProject.token);
	} catch (err) {
		if (err instanceof Error) {
			if (
				err.message === '{"message":"401 Unauthorized"}' ||
				err.message.startsWith('{"error":"invalid_token"')
			) {
				//TODO: alte codes in der nacht löschen
				error(400, 'Dein Beitrittscode ist ungültig. Bitte versuche es erneut.');
			}

			if (
				!err.message.startsWith('{"message":{"access_level":["should be greater than or equal') &&
				!err.message.startsWith('{"message":"Member already exists"}')
			) {
				throw err;
			}
		} else {
			throw err;
		}
	}
	redirect(302, glProject.web_url);
}

async function doNew(bearer_token: string, userId: string, cookies: Cookies): Promise<never> {
	const encrypted = encryptCookie(
		JSON.stringify({
			b: bearer_token,
			i: userId,
		}),
	);

	cookies.set('auth', encrypted, {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		secure: true,
		maxAge: 10 * 60, // seconds
	});

	redirect(302, '/new');
}
