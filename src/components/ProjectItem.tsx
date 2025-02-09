'use client';

import React, { useState, FormEvent } from 'react';
import { PenLine, Trash } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { Card, CardContent } from './ui/card';
import ProjectForm from './ProjectForm';
import IconButton from './IconButton';
import type { Project } from '../types';

type ProjectItemProps = {
	project: Project;
	updateProject: (project: Project, callback: () => void) => void;
	removeProject: (id: string, title: string) => void;
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
		removeProject(project.id, project.title);
	};

	return (
		<Card className="w-full max-w-4xl mb-5">
			{isEditing ? (
				<ProjectForm
					header="Edit Project"
					title={title}
					setTitle={setTitle}
					description={description}
					setDescription={setDescription}
					handleCancel={handleCancel}
					handleSubmit={handleSubmit}
				/>
			) : (
				<CardContent className="mt-5">
					<div className="text-2xl font-bold underline break-words pb-2">
						<Link href={`project/${project.id}`}>
							{project.title}
						</Link>
					</div>
					{project.description && (
						<p className="text-md text-muted-foreground pb-2 whitespace-pre-line break-words">
							{project.description}
						</p>
					)}
					<IconButton tooltip="Edit" onClick={handleEdit}>
						<PenLine className="size-5" />
					</IconButton>
					<IconButton tooltip="Delete" onClick={handleRemove}>
						<Trash className="size-5" />
					</IconButton>
				</CardContent>
			)}
		</Card>
	);
};

export default ProjectItem;
