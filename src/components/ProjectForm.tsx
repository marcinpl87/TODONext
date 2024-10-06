'use client';

import React, { ChangeEvent } from 'react';
import Button from './Button';
import InputText from './InputText';

type ProjectFormProps = {
	title: string;
	setTitle: (value: React.SetStateAction<string>) => void;
	description: string;
	setDescription: (value: React.SetStateAction<string>) => void;
	handleCancel: () => void;
};

const ProjectForm: React.FC<ProjectFormProps> = ({
	title,
	setTitle,
	description,
	setDescription,
	handleCancel,
}) => (
	<>
		<InputText
			type="text"
			placeholder="Title"
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
			<Button className="mr-5" type="submit">
				Save
			</Button>
			<Button onClick={handleCancel}>Cancel</Button>
		</div>
	</>
);

export default ProjectForm;
