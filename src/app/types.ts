export type UserObject = {
	id: string;
	name: string;
};

export enum LOGIN_ACTIONS {
	LOGIN = 'login',
	LOGOUT = 'logout',
}

export type LoginState = boolean;

export type Project = {
	id: string;
	title: string;
	description: string;
	creationTimestamp: number;
};

export type Todo = {
	id: string;
	date: Date | null | undefined;
	title: string;
	isDone: boolean;
	projectId: string;
	description: string;
	estimatedTime: number;
	doneTimestamp: number;
	creationTimestamp: number;
};
