import { env } from '$env/dynamic/private';
import { AccessLevel, type GlProject } from '../types';

export async function addMember(
	projectOrGroupId: string,
	isGroup: boolean,
	userId: string,
	accessLevel: AccessLevel,
	access_token: string,
) {
	const endpoint =
		'/api/v4/' + (isGroup ? 'groups' : 'projects') + '/' + projectOrGroupId + '/members';

	const body = new FormData();
	body.append('user_id', userId);
	body.append('access_level', accessLevel.toString());

	const res = await fetch(env.GITLAB_BASE_URL + endpoint, {
		method: 'POST',
		body,
		headers: {
			'PRIVATE-TOKEN': access_token,
		},
	});

	if (!res.ok) {
		throw new Error(await res.text());
	}
}

export async function createAccessToken(
	projectOrGroupId: string,
	isGroup: boolean,
	accessLevel: AccessLevel,
	bearer_token: string,
	code: string,
): Promise<string> {
	const endpoint =
		'/api/v4/' + (isGroup ? 'groups' : 'projects') + '/' + projectOrGroupId + '/access_tokens';

	const expires_at = new Date();
	expires_at.setFullYear(expires_at.getFullYear() + 1);
	const expires_at_str = expires_at.toISOString();

	const body = {
		name: 'haw-gl-beitrittscode-' + code,
		description:
			'Dieser Token wird für den Beitrittscode "' +
			code +
			'" für die Einladung von neuen Mitgliedern benötigt. Zum entfernen des Beitrittscodes einfach diesen Token löschen.',
		scopes: ['api'],
		access_level: accessLevel,
		expires_at: expires_at_str.substring(0, expires_at_str.indexOf('T')),
	};

	const res = await fetch(env.GITLAB_BASE_URL + endpoint, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			Authorization: 'Bearer ' + bearer_token,
			'Content-Type': 'application/json',
		},
	});

	if (!res.ok) {
		throw new Error(`Error creating access token: ${res.status} - ${await res.text()}`);
	}

	const json = await res.json();

	return json.token;
}

export async function getProject(
	projectOrGroupId: string,
	isGroup: boolean,
	token: string,
	isBearer: boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
	const endpoint = '/api/v4/' + (isGroup ? 'groups' : 'projects') + '/' + projectOrGroupId;

	let headers!: HeadersInit;
	if (isBearer) {
		headers = {
			Authorization: 'Bearer ' + token,
		};
	} else {
		headers = {
			'PRIVATE-TOKEN': token,
		};
	}

	const res = await fetch(env.GITLAB_BASE_URL + endpoint, {
		method: 'GET',
		headers,
	});

	if (!res.ok) {
		throw new Error(await res.text());
	}

	const json = await res.json();

	return json;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getUser(bearer_token: string): Promise<any> {
	const endpoint = '/api/v4/user';

	const res = await fetch(env.GITLAB_BASE_URL + endpoint, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + bearer_token,
		},
	});

	if (!res.ok) {
		throw new Error(`Error getting current user: ${res.status} - ${await res.text()}`);
	}

	const json = await res.json();

	return json;
}

export async function getProjects(isGroup: boolean, bearer_token: string): Promise<[GlProject]> {
	const endpoint = '/api/v4/' + (isGroup ? 'groups' : 'projects');
	const query =
		'?min_access_level=' + AccessLevel.MAINTAINER + '&oder_by=last_activity&simple=true&sort=desc';

	const res = await fetch(env.GITLAB_BASE_URL + endpoint + query, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + bearer_token,
		},
	});

	if (!res.ok) {
		throw new Error(`Error getting project: ${res.status} - ${await res.text()}`);
	}

	const json = await res.json();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return json.map((project: any) => {
		return {
			id: project.id,
			name: project.name,
			web_url: project.web_url,
			star_count: project.star_count,
			namespace: project.namespace?.name,
		};
	});
}
