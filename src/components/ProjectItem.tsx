'use client';

import React, { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import Card from './Card';
import Button from './Button';
import InputText from './InputText';
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

	const handleSave = () => {
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
				<div>
					<InputText
						value={title}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setTitle(e.target.value)
						}
						required
					/>
					<br />
					<InputText
						as="textarea"
						className="block mt-5"
						placeholder="Description"
						value={description}
						onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
							setDescription(e.target.value)
						}
					/>
					<div className="block mt-5 text-right">
						<Button className="mr-5" onClick={handleSave}>
							Save
						</Button>
						<Button onClick={handleCancel}>Cancel</Button>
					</div>
				</div>
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
