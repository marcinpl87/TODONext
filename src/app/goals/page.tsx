'use client';

import React from 'react';
import GoalItem from '../../components/GoalItem';
import LoadingIconTwo from '../../components/LoadingIconTwo';
import GoalCreate from '../../components/GoalCreate';
import { useLogin } from '../../hooks/app';
import { useGoals } from '../../hooks/goals';

const Goals: React.FC = () => {
	const login = useLogin();
	const { goals, isLoading, add, update, remove } = useGoals(login.userId);

	if (isLoading) {
		return (
			<LoadingIconTwo className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="text-2xl font-bold my-5">Goals</h1>
			<GoalCreate addGoal={add} />
			<div className="w-full flex flex-col items-center">
				{goals
					.sort(
						(a, b) =>
							(a.estimatedTime || 0) - (b.estimatedTime || 0),
					)
					.map(goal => (
						<GoalItem
							key={goal.id}
							goal={goal}
							updateGoal={update}
							removeGoal={remove}
						/>
					))}
			</div>
		</div>
	);
};

export default Goals;
