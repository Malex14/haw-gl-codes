export type DbProject = {
	id: number;
	project_id: string;
	is_group: boolean;
	code: string;
	token: string;
	access_level: AccessLevel;
	user_id: string;
};

export type GlProject = {
	id: string;
	name: string;
	web_url: string;
	star_count: number | undefined;
	namespace: string | undefined;
};

export enum AccessLevel {
	NO_ACCESS = 0,
	MINIMAL_ACCESS = 5,
	GUEST = 10,
	PALNNER = 15,
	REPORTER = 20,
	DEVELOPER = 30,
	MAINTAINER = 40,
	OWNER = 50,
}
