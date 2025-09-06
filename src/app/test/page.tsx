'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
	CardDescription,
	CardFooter,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import IconButton from '../../components/IconButton';
import MyAvatar from '../../components/MyAvatar';
import DynamicInputsList from '../../components/DynamicInputsList';
import type { BankTransaction } from '@/types';

const FileUpload: React.FC = () => {
	const [fileContent, setFileContent] = useState<string>('No file selected');
	const handleFileChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const file = event.target.files?.[0];
		if (file && file.type === 'text/plain') {
			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				setFileContent(e.target?.result?.toString() || '');
			};
			reader.readAsText(file);
		} else {
			setFileContent('Please select a valid text file.');
		}
	};

	return (
		<div className="mt-5">
			<input type="file" accept=".txt" onChange={handleFileChange} />
			<div className="mt-5">
				<h3>File Contents:</h3>
				<pre className="max-h-72 overflow-y-auto">{fileContent}</pre>
			</div>
		</div>
	);
};

const Test: React.FC = () => {
	const isAccountFetched = useRef(false);
	const [subtasks, setSubtasks] = useState<string[]>(['']);
	const [errors, setErrors] = useState<string>('');
	const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(
		[],
	);
	const saveBankData = useCallback(async () => {}, []);
	const fetchBankData = useCallback(
		async (continuationKey?: string) => {
			const url = `/api/bank${continuationKey ? `?continuationKey=${continuationKey}` : ''}`;
			fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'application/json',
				},
			})
				.then(response => response.json())
				.then(async data => {
					if (data?.transactions) {
						setBankTransactions(prev => [
							...prev,
							...data.transactions,
						]);
						if (data?.continuationKey) {
							fetchBankData(data.continuationKey);
						} // continuation key is present so fetch more data
						else {
							saveBankData();
						} // continuation key is not present so we can save data
					} // there are transactions so there are no errors
					else {
						setErrors(JSON.stringify(data));
					} // there are no transactions so we assume there are errors
				});
		},
		[saveBankData],
	);

	useEffect(() => {
		if (!isAccountFetched?.current) {
			isAccountFetched.current = true;
			fetchBankData();
		}
	}, [fetchBankData]);

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="my-5 text-2xl font-bold">Bank</h1>
			<Card className="w-full max-w-4xl mb-5">
				<CardHeader>
					<div className="grid gap-2">
						{errors ? (
							<p className="text-sm text-red-500">{errors}</p>
						) : (
							bankTransactions.map((bt, index) => (
								<p
									key={index}
									className="text-sm leading-relaxed break-words mb-2"
								>
									{bt.date};{bt.amount};{bt.receiver};
									{bt.description}
								</p>
							))
						)}
					</div>
				</CardHeader>
			</Card>
			<h1 className="my-5 text-2xl font-bold">Form</h1>
			<Card className="w-full max-w-4xl mb-5">
				<CardHeader>
					<div className="grid gap-2">
						<DynamicInputsList
							label="Define subtasks"
							inputs={subtasks}
							setInputs={setSubtasks}
						/>
					</div>
				</CardHeader>
			</Card>
			<h1 className="mb-5 text-2xl font-bold">File upload</h1>
			<Card className="w-full max-w-4xl mb-5">
				<CardContent>
					<FileUpload />
				</CardContent>
			</Card>
			<h1 className="mb-5 text-2xl font-bold">Card</h1>
			<Card className="w-full max-w-4xl mb-5">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-md">
						2024-09-24 22:00 | 00:15:00 | 1 day ago - 15 hours ago
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
					<IconButton tooltip="Start" onClick={() => {}}>
						<Play className="size-5" />
					</IconButton>
					<IconButton tooltip="Pause" disabled onClick={() => {}}>
						<Pause className="size-5" />
					</IconButton>
					<IconButton tooltip="Stop" onClick={() => {}}>
						<Square className="size-5" />
					</IconButton>
					<IconButton tooltip="Mark as done" onClick={() => {}}>
						<CircleCheckBig className="size-5" />
					</IconButton>
					<IconButton tooltip="Mark as undone" onClick={() => {}}>
						<Undo className="size-5" />
					</IconButton>
					<IconButton tooltip="Add to calendar" onClick={() => {}}>
						<CalendarPlus className="size-5" />
					</IconButton>
					<IconButton tooltip="Edit" onClick={() => {}}>
						<PenLine className="size-5" />
					</IconButton>
					<IconButton tooltip="Delete" onClick={() => {}}>
						<Trash className="size-5" />
					</IconButton>
				</CardContent>
			</Card>
			<h1 className="mb-5 text-2xl font-bold">Form</h1>
			<Card className="w-full max-w-4xl mb-5">
				<CardHeader>
					<CardTitle>Report an issue</CardTitle>
					<CardDescription>
						What area are you having problems with?
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-6">
					<div className="grid gap-2">
						<Label htmlFor="subject">Subject</Label>
						<Input id="subject" placeholder="I need help with..." />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Please include all information relevant to your issue."
						/>
					</div>
				</CardContent>
				<CardFooter className="justify-between space-x-2">
					<Button variant="ghost">Cancel</Button>
					<Button variant="outline">Submit</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Test;
