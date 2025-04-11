import { env } from '$env/dynamic/private';
import type { Configuration } from 'openid-client';
import * as openid_client from 'openid-client';
import jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { redirect, type Cookies } from '@sveltejs/kit';

const openid_config: { config: Configuration | null } = {
	config: null,
};

export const getConfig = async () => {
	if (openid_config.config === null) {
		openid_config.config = await openid_client.discovery(
			new URL(env.OPENID_DISCOVERY_URL),
			env.OPENID_APPID,
			env.OPENID_SECRET,
		);
	}

	return openid_config.config;
};

const jwksClient = new JwksClient({
	jwksUri: env.OPENID_JWKS,
});

export function getKey(
	header: jwt.JwtHeader,
	callback: (error: Error | null, signingKey?: jwt.Secret) => void,
) {
	jwksClient.getSigningKey(header.kid, function (err, key) {
		const signingKey = key?.getPublicKey();
		callback(null, signingKey);
	});
}

export function verifyToken(token: string) {
	return new Promise<string | jwt.JwtPayload | undefined>((resolve, reject) => {
		jwt.verify(token, getKey, (error, decoded) => {
			if (error === null) {
				if (
					decoded !== null &&
					typeof decoded === 'object' &&
					decoded.aud &&
					decoded.aud.includes(env.OPENID_APPID) &&
					decoded.exp &&
					decoded.exp >= new Date().getTime() / 1e3 &&
					decoded.iat &&
					decoded.iat <= new Date().getTime() / 1e3
				) {
					resolve(decoded);
				} else {
					reject('token has either invalid format, has not the right audience or is expired');
				}
			} else {
				reject(error);
			}
		});
	});
}

export enum Action {
	JOIN = 'JOIN',
	NEW = 'NEW',
}

export async function authCodeFlow(
	cookies: Cookies,
	scope: string,
	action: Action,
): Promise<never> {
	const config = await getConfig();

	const nonce = action.toString() + '-' + openid_client.randomNonce();
	const parameters: Record<string, string> = {
		redirect_uri: env.OPENID_REDIRECT_URL,
		scope,
		state: nonce,
		prompt: 'consent',
	};

	cookies.set('nonce', nonce, {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		secure: true,
		maxAge: 120, // seconds
	});

	redirect(302, openid_client.buildAuthorizationUrl(config, parameters));
}
