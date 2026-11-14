'use client';

import React, { useState, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLogin } from '../hooks/app';
import { Card } from './ui/card';
import { Button } from './ui/button';
import HabitForm from './HabitForm';
import type { Habit } from '../types/project';

type HabitCreateProps = {
	addHabit: (habit: Habit, callback: () => void) => void;
};

const HabitCreate: React.FC<HabitCreateProps> = ({ addHabit }) => {
	const login = useLogin();
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [title, setTitle] = useState<string>('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		addHabit(
			{
				id: uuidv4(),
				userId: login.userId,
				title,
				creationTimestamp: Date.now(),
				dates: [],
			},
			() => {
				setTitle('');
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
					<HabitForm
						header="New habit"
						title={title}
						setTitle={setTitle}
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
					New habit
				</Button>
			)}
		</>
	);
};

export default HabitCreate;
