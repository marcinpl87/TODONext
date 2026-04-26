'use client';

import React, { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLogin } from '../hooks/app';
import { Card } from './ui/card';
import { Button } from './ui/button';
import GoalForm from './GoalForm';
import type { Goal } from '../types/project';

type GoalCreateProps = {
	addGoal: (goal: Goal, callback: () => void) => void;
};

const GoalCreate: React.FC<GoalCreateProps> = ({ addGoal }) => {
	const login = useLogin();
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [estimatedTime, setEstimatedTime] = useState<Date | null>(null);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		addGoal(
			{
				id: uuidv4(),
				userId: login.userId,
				title,
				description,
				estimatedTime: estimatedTime ? estimatedTime.getTime() : 0,
				creationTimestamp: Date.now(),
			},
			() => {
				setTitle('');
				setDescription('');
				setEstimatedTime(null);
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
					<GoalForm
						header="New goal"
						title={title}
						setTitle={setTitle}
						description={description}
						setDescription={setDescription}
						estimatedTime={estimatedTime || null}
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
					New goal
				</Button>
			)}
		</>
	);
};

export default GoalCreate;
