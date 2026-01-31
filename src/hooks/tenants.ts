'use client';

import { useState, useEffect } from 'react';
import type { Tenant } from '../types/realEstate';

export const useTenants = (userId: string) => {
	const [tenants, setTenants] = useState<Tenant[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const fetchTenants = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch('/api/tenant', {
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
				setTenants(data?.data || []);
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
		fetchTenants();
	}, []);
	const add = (tenant: Tenant, callback: () => void) => {
		const cache = [...tenants];
		setTenants([tenant, ...tenants]);
		callback();
		fetch('/api/tenant', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				tenant,
			}),
		}).catch(() => {
			setTenants([...cache]); // revert back to the previous state
		});
	};
	const update = (updatedTenant: Tenant, callback: () => void) => {
		const cache = [...tenants];
		setTenants([
			...tenants.map(tenant =>
				tenant.id === updatedTenant.id ? updatedTenant : tenant,
			),
		]);
		callback();
		fetch(`/api/tenant/${updatedTenant.id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				tenant: updatedTenant,
			}),
		}).catch(() => {
			setTenants([...cache]); // revert back to the previous state
		});
	};
	const remove = (id: string, name: string) => {
		if (
			confirm(
				`Are you sure you want to remove "${name}" (the Tenant will be permanently deleted) ?`,
			)
		) {
			const cache = [...tenants];
			setTenants([...tenants.filter(tenant => tenant.id !== id)]);
			fetch(`/api/tenant/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'application/json',
				},
			}).catch(() => {
				setTenants([...cache]); // revert back to the previous state
			});
		}
	};

	return { tenants, add, update, remove, isLoading, error };
};
