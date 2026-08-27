import { betterAuth } from 'better-auth';
import { pool } from './db';

const localOrigin = 'http://localhost:3000';

const configuredOrigin = (() => {
	const raw = process.env.BETTER_AUTH_URL;
	if (!raw) {
		return undefined;
	}
	try {
		return new URL(raw).origin;
	} catch {
		return raw;
	}
})();

const trustedOrigins = [configuredOrigin, localOrigin].filter(
	(origin, index, origins): origin is string =>
		Boolean(origin) && origins.indexOf(origin) === index,
);

export const auth = betterAuth({
	database: pool,
	advanced: {
		database: {
			// Existing app tables store userId as uuid.
			generateId: () => crypto.randomUUID(),
		},
	},
	emailAndPassword: {
		enabled: true,
		disableSignUp: true,
		requireEmailVerification: false,
	},
	plugins: [],
	user: {
		modelName: 'bauth_user',
		additionalFields: {
			status: {
				type: 'string',
				required: false,
				defaultValue: 'active',
				input: false,
			},
		},
	},
	session: {
		modelName: 'bauth_session',
	},
	account: {
		modelName: 'bauth_account',
	},
	verification: {
		modelName: 'bauth_verification',
	},
	trustedOrigins,
});
