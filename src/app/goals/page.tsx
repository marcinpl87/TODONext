'use client';

import React from 'react';
import TodoItem from '../../components/TodoItem';
import type { Todo } from '../../types/project';

const Goals: React.FC = () => {
	const goals: Todo[] = [
		{
			date: null,
			id: '',
			userId: '',
			projectId: '',
			title: 'test',
			description: 'desc',
			subtasks: { data: [] },
			creationTimestamp: 1767045002817,
			estimatedTime: 24 * 3600 - 1,
			isDone: false,
			doneTimestamp: 0,
		},
	];

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="text-2xl font-bold my-5">Goals</h1>
			<div className="w-full flex flex-col items-center">
				{goals
					.sort(
						(a, b) =>
							(b.doneTimestamp || 0) - (a.doneTimestamp || 0),
					)
					.map(goal => (
						<TodoItem
							key={goal.id}
							todo={goal}
							updateTodo={() => {}}
							removeTodo={() => {}}
						/>
					))}
			</div>
		</div>
	);
};

export default Goals;
