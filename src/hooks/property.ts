'use client';

import { useState, useEffect } from 'react';
import type { Property } from '../types/realEstate';

export const useProperty = (id: string) => {
	const [property, setProperty] = useState<Property | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProperty = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch(`/api/property/${id}`, {
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
					throw new Error('Failed to fetch properties');
				}
				const data = await response.json();
				if (!id || !data) {
					setError('Property not found');
				}
				setProperty(data?.data || null);
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
		fetchProperty();
	}, [id]);

	return { property, isLoading, error };
};
