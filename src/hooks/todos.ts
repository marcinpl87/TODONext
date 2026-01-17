'use client';

import { useState, useEffect } from 'react';
import type { Todo } from '../types/project';

export const useTodos = (userId: string) => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const fetchTodos = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch('/api/todo', {
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
					throw new Error('Failed to fetch todos');
				}
				const data = await response.json();
				setTodos(data?.data || []);
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
		fetchTodos();
	}, []);
	const add = (todo: Todo, callback: () => void) => {
		const cache = [...todos];
		setTodos([todo, ...todos]);
		callback();
		fetch('/api/todo', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				todo,
			}),
		}).catch(() => {
			setTodos([...cache]); // revert back to the previous state
		});
	};
	const update = (
		updatedTodo: Todo,
		callback: () => void,
		errorCallback?: () => void,
	) => {
		const cache = [...todos];
		setTodos([
			...todos.map(todo =>
				todo.id === updatedTodo.id ? updatedTodo : todo,
			),
		]);
		callback();
		fetch(`/api/todo/${updatedTodo.id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				todo: updatedTodo,
			}),
		}).catch(() => {
			setTodos([...cache]); // revert back to the previous state
			errorCallback &&
				typeof errorCallback === 'function' &&
				errorCallback();
		});
	};
	const remove = (id: string, title: string) => {
		if (
			confirm(
				`Are you sure you want to remove "${title}" (the TODO will be permanently deleted) ?`,
			)
		) {
			const cache = [...todos];
			setTodos([...todos.filter(todo => todo.id !== id)]);
			fetch(`/api/todo/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'application/json',
				},
			}).catch(() => {
				setTodos([...cache]); // revert back to the previous state
			});
		}
	};

	return { todos, add, update, remove, isLoading, error };
};
