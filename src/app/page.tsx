'use client';

import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import InputText from '../components/InputText';
import ProjectCreate from '../components/ProjectCreate';
import ProjectItem from '../components/ProjectItem';
import LoadingIcon from '../components/LoadingIcon';
import { useProjects, useLogin, useTodos } from '../hooks';
import { LS_KEY_PROJECTS, LS_KEY_TODOS } from '../consts';
import type { Project, Todo } from '../types';

const Home: React.FC = () => {
	const login = useLogin();
	const { projects: lsProjects, isLoading: isProjectLoading } = useProjects();
	const [projectsState, setProjectsState] = useState<Project[]>([]);
	const { todos: lsTodos, isLoading: isTodoLoading } = useTodos();
	const exportData: Record<string, Array<Project | Todo>> = {
		[LS_KEY_PROJECTS]: [...projectsState].reverse(), // reverse to import the oldest first
		[LS_KEY_TODOS]: [...lsTodos].reverse(), // reverse to import the oldest first
	};
	const addProject = (project: Project, callback: () => void) => {
		const cache = [...projectsState];
		setProjectsState([project, ...projectsState]);
		callback();
		fetch('/api/project', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId: login.userId,
				project,
			}),
		}).catch(() => {
			setProjectsState([...cache]); // revert back to the previous state
		});
	};
	const updateProject = (updatedProject: Project, callback: () => void) => {
		const cache = [...projectsState];
		setProjectsState([
			...projectsState.map(project =>
				project.id === updatedProject.id ? updatedProject : project,
			),
		]);
		callback();
		fetch(`/api/project/${updatedProject.id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId: login.userId,
				project: updatedProject,
			}),
		}).catch(() => {
			setProjectsState([...cache]); // revert back to the previous state
		});
	};
	const removeProject = (id: string, title: string) => {
		if (
			confirm(
				`Are you sure you want to remove "${title}" (the Project will be permanently deleted) ?`,
			)
		) {
			const cache = [...projectsState];
			setProjectsState([
				...projectsState.filter(project => project.id !== id),
			]);
			fetch(`/api/project/${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			}).catch(() => {
				setProjectsState([...cache]); // revert back to the previous state
			});
		}
	};
	const onExport = () => {
		navigator.clipboard.writeText(JSON.stringify(exportData));
	};
	const onImport = () => {
		const textEl = document?.getElementById('import') as HTMLInputElement;
		if (textEl?.value) {
			const data = JSON.parse(textEl.value);
			if (data[LS_KEY_PROJECTS]) {
				fetch('/api/project/import', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						userId: login.userId,
						projects: data[LS_KEY_PROJECTS],
					}),
				});
			}
			if (data[LS_KEY_TODOS]) {
				fetch('/api/todo/import', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						userId: login.userId,
						todos: data[LS_KEY_TODOS],
					}),
				});
			}
		}
	};

	useEffect(() => {
		setProjectsState(lsProjects);
	}, [lsProjects]);

	if (isProjectLoading || isTodoLoading) {
		return (
			<LoadingIcon className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="text-2xl font-bold my-5">Projects</h1>
			<ProjectCreate addProject={addProject} />
			{projectsState
				.sort(
					(a, b) =>
						(b.creationTimestamp || 0) - (a.creationTimestamp || 0),
				)
				.map(project => (
					<ProjectItem
						key={project.id}
						project={project}
						updateProject={updateProject}
						removeProject={removeProject}
					/>
				))}
			<h1 className="mb-5 text-2xl font-bold">Export / import</h1>
			<Card>
				<p className="text-[7px] leading-[7px] break-all font-mono overflow-hidden">
					{JSON.stringify(exportData)}
				</p>
				<Button className="block mt-5" onClick={onExport}>
					Copy to clipboard
				</Button>
			</Card>
			<Card>
				<InputText
					as="textarea"
					id="import"
					className="block"
					placeholder="Paste exported JSON data here"
				></InputText>
				<Button className="block mt-5" onClick={onImport}>
					Import
				</Button>
			</Card>
		</div>
	);
};

export default Home;
