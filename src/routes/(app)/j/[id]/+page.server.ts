import { getProject as getDbProject } from '$lib/server/db';
import { getProject as getGlProject } from '$lib/server/gitlab';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const db = locals.db;
	const id = params.id;

	const dbProject = await getDbProject(db, id);
	if (dbProject === undefined) {
		error(404, 'Ungültiger Code');
	}

	const glProject = await getGlProject(dbProject.project_id, dbProject.is_group, dbProject.token);

	return {
		project: {
			id: glProject.id,
			name: glProject.name,
			web_url: glProject.web_url,
			star_count: glProject.star_count,
			namespace: glProject.namespace.name,
		},
	};
};
