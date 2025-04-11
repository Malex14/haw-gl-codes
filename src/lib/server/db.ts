import type { AccessLevel, DbProject } from '$lib/types';
import sqlite from 'sqlite3';

export async function insertProject(
	db: sqlite.Database,
	projectId: string,
	isGroup: boolean,
	code: string,
	accessToken: string,
	access_level: AccessLevel,
	user_id: string,
) {
	const query =
		'INSERT INTO projects (project_id, is_group, code, token, access_level, user_id) VALUES (?, ?, ?, ?, ?, ?)';
	const stmt = db.prepare(query, projectId, isGroup, code, accessToken, access_level, user_id);

	await new Promise<void>((res, rej) => {
		stmt.run((err) => {
			if (err) {
				rej(err);
				return;
			}
			res();
		});
	});
}

export async function createRepoTable(db: sqlite.Database) {
	const query =
		'CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, project_id TEXT NOT NULL, is_group BOOLEAN NOT NULL, code TEXT UNIQUE NOT NULL, token TEXT NOT NULL, access_level INTEGER NOT NULL, user_id TEXT NOT NULL)';

	await new Promise<void>((res, rej) => {
		db.run(query, (err) => {
			if (err) rej(err);
			res();
		});
	});
}

export function getProject(db: sqlite.Database, code: string): Promise<DbProject | undefined> {
	const query = 'SELECT * FROM projects WHERE code = ?';
	const stmt = db.prepare(query, code);

	return new Promise((res, rej) => {
		stmt.all<DbProject>((err, rows) => {
			if (err) {
				rej(err);
				return;
			}
			if (rows.length > 1) {
				rej(new Error('unexpected number of records returned'));
				return;
			}

			res(rows[0]);
		});
	});
}

export function linkExists(db: sqlite.Database, code: string): Promise<boolean> {
	const query = 'SELECT EXISTS (SELECT 1 FROM projects WHERE code = ?) ';
	const stmt = db.prepare(query, code);

	return new Promise((res, rej) => {
		stmt.all<{ exists: boolean }>((err, rows) => {
			if (err) {
				rej(err);
				return;
			}
			res(Object.values(rows[0])[0]);
		});
	});
}
