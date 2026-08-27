import { authClient } from './auth-client';

// Utility function to make authenticated API requests.
// The session cookie is sent automatically on same-origin fetches.
export const authenticatedFetch = async (
	url: string,
	options: RequestInit = {},
): Promise<Response> => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>),
	};

	return fetch(url, {
		...options,
		headers,
		credentials: 'same-origin',
	});
};

export const logout = (): void => {
	void authClient.signOut().finally(() => {
		window.location.reload();
	});
};
