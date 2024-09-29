'use client';

import React, { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Card from './Card';
import Button from './Button';
import TodoForm from './TodoForm';
import { DEFAULT_TIMEOUT } from '../consts';
import type { Todo } from '../types';

type TodoCreateProps = {
	addTodo: (todo: Todo, callback: () => void) => void;
	projectId: string;
};

const TodoCreate: React.FC<TodoCreateProps> = ({ addTodo, projectId }) => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [estimatedTime, setEstimatedTime] = useState<number>(DEFAULT_TIMEOUT);
	const [startDate, setStartDate] = useState<Date | null>();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		addTodo(
			{
				id: uuidv4(),
				projectId: projectId || '',
				title,
				date: startDate || null,
				description,
				estimatedTime,
				isDone: false,
				doneTimestamp: 0,
				creationTimestamp: Date.now(),
			},
			() => {
				setTitle('');
				setDescription('');
				setEstimatedTime(0);
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
				<Card as="form" onSubmit={handleSubmit}>
					<TodoForm
						title={title}
						setTitle={setTitle}
						description={description}
						setDescription={setDescription}
						startDate={startDate}
						setStartDate={setStartDate}
						estimatedTime={estimatedTime}
						setEstimatedTime={setEstimatedTime}
						handleCancel={handleCancel}
					/>
				</Card>
			) : (
				<Button className="mb-5" onClick={() => setIsOpened(true)}>
					New TODO
				</Button>
			)}
		</>
	);
};

export default TodoCreate;
