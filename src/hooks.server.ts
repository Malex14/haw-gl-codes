import { createRepoTable } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import sqlite from 'sqlite3';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.locals.db) {
		const db = new sqlite.Database('db.sqlite', (err) => {
			if (err) throw err;
		});

		event.locals.db = db;

		await createRepoTable(db);
	}

	return await resolve(event);
};
