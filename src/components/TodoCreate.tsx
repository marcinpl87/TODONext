'use client';

import React, { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLogin } from '../hooks';
import { Card } from './ui/card';
import { Button } from './ui/button';
import TodoForm from './TodoForm';
import { DEFAULT_TIMEOUT } from '../consts';
import type { Todo } from '../types/project';

type TodoCreateProps = {
	addTodo: (todo: Todo, callback: () => void) => void;
	projectId: string;
};

const TodoCreate: React.FC<TodoCreateProps> = ({ addTodo, projectId }) => {
	const login = useLogin();
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [subtasks, setSubtasks] = useState<string[]>(['']);
	const [estimatedTime, setEstimatedTime] = useState<number>(DEFAULT_TIMEOUT);
	const [startDate, setStartDate] = useState<Date | null>();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		addTodo(
			{
				id: uuidv4(),
				userId: login.userId,
				projectId: projectId || '',
				title,
				date: startDate || null,
				description,
				subtasks: {
					data: subtasks
						.filter(Boolean)
						.map(task => ({ task, isDone: false })),
				},
				estimatedTime,
				isDone: false,
				doneTimestamp: 0,
				creationTimestamp: Date.now(),
			},
			() => {
				setTitle('');
				setDescription('');
				setSubtasks(['']);
				setEstimatedTime(DEFAULT_TIMEOUT);
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
					<TodoForm
						header="New TODO"
						title={title}
						setTitle={setTitle}
						description={description}
						setDescription={setDescription}
						subtasks={subtasks}
						setSubtasks={setSubtasks}
						startDate={startDate}
						setStartDate={setStartDate}
						estimatedTime={estimatedTime}
						setEstimatedTime={setEstimatedTime}
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
					New TODO
				</Button>
			)}
		</>
	);
};

export default TodoCreate;
