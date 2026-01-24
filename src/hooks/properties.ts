'use client';

import { useState, useEffect } from 'react';
import type { Property } from '../types/realEstate';

export const useProperties = (userId: string) => {
	const [properties, setProperties] = useState<Property[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const fetchProperties = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch('/api/property', {
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
				setProperties(data?.data || []);
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
		fetchProperties();
	}, []);
	const add = (property: Property, callback: () => void) => {
		const cache = [...properties];
		setProperties([property, ...properties]);
		callback();
		fetch('/api/property', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				property,
			}),
		}).catch(() => {
			setProperties([...cache]); // revert back to the previous state
		});
	};
	const update = (updatedProperty: Property, callback: () => void) => {
		const cache = [...properties];
		setProperties([
			...properties.map(property =>
				property.id === updatedProperty.id ? updatedProperty : property,
			),
		]);
		callback();
		fetch(`/api/property/${updatedProperty.id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				property: updatedProperty,
			}),
		}).catch(() => {
			setProperties([...cache]); // revert back to the previous state
		});
	};
	const remove = (id: string, name: string) => {
		if (
			confirm(
				`Are you sure you want to remove "${name}" (the Property will be permanently deleted) ?`,
			)
		) {
			const cache = [...properties];
			setProperties([
				...properties.filter(property => property.id !== id),
			]);
			fetch(`/api/property/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'application/json',
				},
			}).catch(() => {
				setProperties([...cache]); // revert back to the previous state
			});
		}
	};

	return { properties, add, update, remove, isLoading, error };
};
