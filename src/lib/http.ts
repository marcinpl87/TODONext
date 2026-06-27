// Utility function to make authenticated API requests
export const authenticatedFetch = async (
	url: string,
	options: RequestInit = {},
): Promise<Response> => {
	const token = localStorage.getItem('authToken');

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>),
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	return fetch(url, {
		...options,
		headers,
	});
};

// Utility function to handle logout
export const logout = (): void => {
	localStorage.removeItem('authToken');
	window.location.reload(); // Refresh to trigger login form
};
