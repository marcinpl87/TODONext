'use client';

import { useState, useEffect } from 'react';
import type { Goal } from '../types/project';

export const useGoals = (userId: string) => {
	const [goals, setGoals] = useState<Goal[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const fetchGoals = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch('/api/goal', {
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
					throw new Error('Failed to fetch goals');
				}
				const data = await response.json();
				setGoals(data?.data || []);
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
		fetchGoals();
	}, []);
	const add = (goal: Goal, callback: () => void) => {
		const cache = [...goals];
		setGoals([goal, ...goals]);
		callback();
		fetch('/api/goal', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				goal,
			}),
		}).catch(() => {
			setGoals([...cache]); // revert back to the previous state
		});
	};
	const update = (
		updatedGoal: Goal,
		callback: () => void,
		errorCallback?: () => void,
	) => {
		const cache = [...goals];
		setGoals([
			...goals.map(goal =>
				goal.id === updatedGoal.id ? updatedGoal : goal,
			),
		]);
		callback();
		fetch(`/api/goal/${updatedGoal.id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				goal: updatedGoal,
			}),
		}).catch(() => {
			setGoals([...cache]); // revert back to the previous state
			errorCallback &&
				typeof errorCallback === 'function' &&
				errorCallback();
		});
	};
	const remove = (id: string, title: string) => {
		if (
			confirm(
				`Are you sure you want to remove "${title}" (the goal will be permanently deleted) ?`,
			)
		) {
			const cache = [...goals];
			setGoals([...goals.filter(goal => goal.id !== id)]);
			fetch(`/api/goal/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'application/json',
				},
			}).catch(() => {
				setGoals([...cache]); // revert back to the previous state
			});
		}
	};

	return { goals, add, update, remove, isLoading, error };
};
