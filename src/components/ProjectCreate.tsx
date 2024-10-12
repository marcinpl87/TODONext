'use client';

import React, { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from './ui/card';
import { Button } from './ui/button';
import ProjectForm from './ProjectForm';
import type { Project } from '../types';

type ProjectCreateProps = {
	addProject: (project: Project, callback: () => void) => void;
};

const ProjectCreate: React.FC<ProjectCreateProps> = ({ addProject }) => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		addProject(
			{
				id: uuidv4(),
				title,
				description,
				creationTimestamp: Date.now(),
			},
			() => {
				setTitle('');
				setDescription('');
				setIsOpened(false);
			},
		);
	};

	const handleCancel = () => {
		setIsOpened(false);
	};

	return (
		<>
			{isOpened ? (
				<Card className="w-full max-w-4xl mb-5">
					<ProjectForm
						header="New Project"
						title={title}
						setTitle={setTitle}
						description={description}
						setDescription={setDescription}
						handleCancel={handleCancel}
						handleSubmit={handleSubmit}
					/>
				</Card>
			) : (
				<Button
					className="mb-5"
					variant="outline"
					onClick={() => setIsOpened(true)}
				>
					New Project
				</Button>
			)}
		</>
	);
};

export default ProjectCreate;
