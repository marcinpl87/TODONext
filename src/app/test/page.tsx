'use client';

import React from 'react';
import {
	CalendarPlus,
	CircleCheckBig,
	Pause,
	PenLine,
	Play,
	Square,
	Trash,
	Undo,
} from 'lucide-react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '../../components/ui/card';
import MyAvatar from '../../components/MyAvatar';
import { Button } from '../../components/ui/button';

const Home: React.FC = () => {
	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="my-5 text-2xl font-bold">Test</h1>
			<Card className="w-full max-w-4xl mb-5">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-md">
						00:15:00 (1 day ago - 15 hours ago)
					</CardTitle>
					<MyAvatar />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						Title Title Title Title Title Title Title
					</div>
					<p className="text-md text-muted-foreground py-1">
						Content Content Content Content Content Content Content
						Content Content Content Content Content Content Content
						Content Content Content Content Content Content Content
						Content Content Content Content Content Content Content
						Content Content Content Content Content Content Content
						Content Content Content Content Content
					</p>
					<Button variant="ghost" size="icon" onClick={() => {}}>
						<Play className="size-5" />
					</Button>
					<Button
						disabled
						variant="ghost"
						size="icon"
						onClick={() => {}}
					>
						<Pause className="size-5" />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => {}}>
						<Square className="size-5" />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => {}}>
						<CircleCheckBig className="size-5" />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => {}}>
						<Undo className="size-5" />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => {}}>
						<CalendarPlus className="size-5" />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => {}}>
						<PenLine className="size-5" />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => {}}>
						<Trash className="size-5" />
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default Home;
