export type Project = {
	id: string;
	userId: string;
	title: string;
	description: string;
	creationTimestamp: number;
};

export type Subtasks = { data: { task: string; isDone: boolean }[] };

export type Todo = {
	id: string;
	date: Date | null | undefined;
	title: string;
	isDone: boolean;
	userId: string;
	projectId: string;
	description: string;
	subtasks: Subtasks;
	estimatedTime: number;
	doneTimestamp: number;
	creationTimestamp: number;
};
