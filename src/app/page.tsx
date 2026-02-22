'use client';

import React from 'react';
import ProjectCreate from '../components/ProjectCreate';
import ProjectItem from '../components/ProjectItem';
import LoadingIconTwo from '../components/LoadingIconTwo';
import { useProjects } from '../hooks/projects';
import { useLogin } from '../hooks/app';

const Home: React.FC = () => {
	const login = useLogin();
	const { projects, isLoading, add, update, remove } = useProjects(
		login.userId,
	);

	if (isLoading) {
		return (
			<LoadingIconTwo className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="text-2xl font-bold my-5">Projects</h1>
			<ProjectCreate addProject={add} />
			{projects
				.sort(
					(a, b) =>
						(b.creationTimestamp || 0) - (a.creationTimestamp || 0),
				)
				.map(project => (
					<ProjectItem
						key={project.id}
						project={project}
						updateProject={update}
						removeProject={remove}
					/>
				))}
		</div>
	);
};

export default Home;
