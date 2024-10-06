'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import Card from './Card';
import Button from './Button';
import ProjectForm from './ProjectForm';
import type { Project } from '../types';

type ProjectItemProps = {
	project: Project;
	updateProject: (project: Project, callback: () => void) => void;
	removeProject: (id: string) => void;
};

const ProjectItem: React.FC<ProjectItemProps> = ({
	project,
	updateProject,
	removeProject,
}) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [title, setTitle] = useState<string>(project.title);
	const [description, setDescription] = useState<string>(project.description);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		updateProject(
			{
				...project,
				title,
				description,
			},
			() => {
				setIsEditing(false);
			},
		);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleRemove = () => {
		removeProject(project.id);
	};

	return (
		<Card as="li">
			{isEditing ? (
				<form onSubmit={handleSubmit}>
					<ProjectForm
						title={title}
						setTitle={setTitle}
						description={description}
						setDescription={setDescription}
						handleCancel={handleCancel}
					/>
				</form>
			) : (
				<div>
					<h3 className="font-bold underline text-xl mb-5">
						<Link href={`project/${project.id}`}>
							{project.title}
						</Link>
					</h3>
					{project.description && (
						<p className="whitespace-pre-line">
							{project.description}
						</p>
					)}
					<div className="mt-5">
						<Button onClick={handleEdit}>✏️</Button>{' '}
						<Button onClick={handleRemove}>🗑️</Button>
					</div>
				</div>
			)}
		</Card>
	);
};

export default ProjectItem;
