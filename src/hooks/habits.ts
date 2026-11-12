'use client';

import { useState, useEffect } from 'react';
import type { Habit } from '../types/project';

export const useHabits = (userId: string) => {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const fetchHabits = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch('/api/habit', {
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
					throw new Error('Failed to fetch habits');
				}
				const data = await response.json();
				setHabits(data?.data || []);
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
		fetchHabits();
	}, []);
	const add = (habit: Habit, callback: () => void) => {
		const cache = [...habits];
		setHabits([habit, ...habits]);
		callback();
		fetch('/api/habit', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				habit,
			}),
		}).catch(() => {
			setHabits([...cache]); // revert back to the previous state
		});
	};
	const update = (
		updatedHabit: Habit,
		callback: () => void,
		errorCallback?: () => void,
	) => {
		const cache = [...habits];
		setHabits([
			...habits.map(habit =>
				habit.id === updatedHabit.id ? updatedHabit : habit,
			),
		]);
		callback();
		fetch(`/api/habit/${updatedHabit.id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				habit: updatedHabit,
			}),
		}).catch(() => {
			setHabits([...cache]); // revert back to the previous state
			errorCallback &&
				typeof errorCallback === 'function' &&
				errorCallback();
		});
	};
	const remove = (id: string, title: string) => {
		if (
			confirm(
				`Are you sure you want to remove "${title}" (the habit will be permanently deleted) ?`,
			)
		) {
			const cache = [...habits];
			setHabits([...habits.filter(habit => habit.id !== id)]);
			fetch(`/api/habit/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'application/json',
				},
			}).catch(() => {
				setHabits([...cache]); // revert back to the previous state
			});
		}
	};

	return { habits, add, update, remove, isLoading, error };
};
