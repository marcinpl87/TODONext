'use client';

import { useState, useEffect } from 'react';
import type { Tenant } from '../types/realEstate';

export const useTenant = (id: string) => {
	const [tenant, setTenant] = useState<Tenant | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTenant = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch(`/api/tenant/${id}`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
						'Content-Type': 'application/json',
					},
				});
				if (!response.ok) {
					if (response.status === 401) {
						// Token expired or invalid, redirect to login
						localStorage.removeItem('authToken');
						window.location.reload();
						return;
					}
					throw new Error('Failed to fetch tenants');
				}
				const data = await response.json();
				if (!id || !data) {
					setError('Tenant not found');
				}
				setTenant(data?.data || null);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('An unknown error occurred');
				}
			} finally {
				setIsLoading(false);
			}
		};
		fetchTenant();
	}, [id]);

	return { tenant, isLoading, error };
};
