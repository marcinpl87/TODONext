'use client';

import React from 'react';
import HabitItem from '../../components/HabitItem';
import LoadingIconTwo from '../../components/LoadingIconTwo';
import HabitCreate from '../../components/HabitCreate';
import { useLogin } from '../../hooks/app';
import { useHabits } from '../../hooks/habits';

const Habits: React.FC = () => {
	const login = useLogin();
	const { habits, isLoading, add, update, remove } = useHabits(login.userId);

	if (isLoading) {
		return (
			<LoadingIconTwo className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="text-2xl font-bold my-5">Habits</h1>
			<HabitCreate addHabit={add} />
			<div className="w-full flex flex-col items-center">
				{habits
					.sort(
						(a, b) =>
							(b.creationTimestamp || 0) -
							(a.creationTimestamp || 0),
					)
					.map(habit => (
						<HabitItem
							key={habit.id}
							habit={habit}
							updateHabit={update}
							removeHabit={remove}
						/>
					))}
			</div>
		</div>
	);
};

export default Habits;
