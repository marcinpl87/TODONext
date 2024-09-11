'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Card from './Card';
import Button from './Button';
import InputText from './InputText';
import type { Project } from '../types';

type ProjectFormProps = {
	addProject: (project: Project, callback: () => void) => void;
};

const ProjectForm: React.FC<ProjectFormProps> = ({ addProject }) => {
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

	return (
		<>
			{isOpened ? (
				<Card as="form" onSubmit={handleSubmit}>
					<InputText
						type="text"
						placeholder="Title"
						value={title}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setTitle(e.target.value)
						}
						required
					/>
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
						<Button className="mr-5" type="submit">
							Save
						</Button>
						<Button onClick={() => setIsOpened(false)}>
							Cancel
						</Button>
					</div>
				</Card>
			) : (
				<Button className="mb-5" onClick={() => setIsOpened(true)}>
					New Project
				</Button>
			)}
		</>
	);
};

export default ProjectForm;
