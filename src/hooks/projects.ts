'use client';

import { useState, useEffect } from 'react';
import type { Project } from '../types/project';

export const useProjects = (userId: string) => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const fetchProjects = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch('/api/project', {
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
					throw new Error('Failed to fetch projects');
				}
				const data = await response.json();
				setProjects(data?.data || []);
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
		fetchProjects();
	}, []);
	const add = (project: Project, callback: () => void) => {
		const cache = [...projects];
		setProjects([project, ...projects]);
		callback();
		fetch('/api/project', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				project,
			}),
		}).catch(() => {
			setProjects([...cache]); // revert back to the previous state
		});
	};
	const update = (updatedProject: Project, callback: () => void) => {
		const cache = [...projects];
		setProjects([
			...projects.map(project =>
				project.id === updatedProject.id ? updatedProject : project,
			),
		]);
		callback();
		fetch(`/api/project/${updatedProject.id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				project: updatedProject,
			}),
		}).catch(() => {
			setProjects([...cache]); // revert back to the previous state
		});
	};
	const remove = (id: string, title: string) => {
		if (
			confirm(
				`Are you sure you want to remove "${title}" (the Project will be permanently deleted) ?`,
			)
		) {
			const cache = [...projects];
			setProjects([...projects.filter(project => project.id !== id)]);
			fetch(`/api/project/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'application/json',
				},
			}).catch(() => {
				setProjects([...cache]); // revert back to the previous state
			});
		}
	};

	return {
		projects,
		add,
		update,
		remove,
		isLoading,
		error,
	};
};
