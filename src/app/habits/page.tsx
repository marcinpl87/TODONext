'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import HabitItem from '../../components/HabitItem';
import LoadingIconTwo from '../../components/LoadingIconTwo';
import HabitCreate from '../../components/HabitCreate';
import IconButton from '../../components/IconButton';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { useLogin } from '../../hooks/app';
import { useHabits } from '../../hooks/habits';

const SOURCE_URL = 'https://www.youtube.com/watch?v=Ocr0bdB1d9M';

const Habits: React.FC = () => {
	const login = useLogin();
	const { habits, isLoading, add, update, complete, remove } = useHabits(
		login.userId,
	);

	if (isLoading) {
		return (
			<LoadingIconTwo className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="text-2xl font-bold my-5">Habits</h1>
			<Card className="w-full max-w-4xl mb-5">
				<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
					<ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
						<li>Block 60 minutes daily to work on each habit.</li>
						<li>
							During that time, no email, Slack, or other
							distractions.
						</li>
						<li>
							You have only two acceptable options: work on the
							task or do nothing.
						</li>
						<li>
							No checking your phone, snacking, fiddling with
							things, or getting up unnecessarily.
						</li>
						<li>
							If you don&apos;t feel like working, simply sit
							there doing nothing. Eventually, the work
							you&apos;ve been avoiding becomes more attractive.
						</li>
					</ul>
				</CardHeader>
				<CardContent>
					<IconButton
						tooltip="Source"
						onClick={() =>
							window.open(
								SOURCE_URL,
								'_blank',
								'noopener,noreferrer',
							)
						}
					>
						<ExternalLink className="size-5" />
					</IconButton>
				</CardContent>
			</Card>
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
							completeHabit={complete}
							removeHabit={remove}
						/>
					))}
			</div>
		</div>
	);
};

export default Habits;
