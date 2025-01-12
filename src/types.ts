export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
};

export type UserObject = {
	id: string;
	name: string;
};

export enum LOGIN_ACTIONS {
	LOGIN = 'login',
	LOGOUT = 'logout',
}

export type LoginDispatch = {
	action: LOGIN_ACTIONS;
	userId: string;
	userName: string;
	users: UserObject[];
};

export type LoginState = {
	isLoggedIn: boolean;
	userId: string;
	userName: string;
	users: UserObject[];
};

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

export type Property = {
	id: string;
	creationTimestamp: number;
	name: string;
	address: string;
	floor: number;
	code: string;
	wifiSsid: string;
	wifiPass: string;
	rooms: number;
	lockIn: string;
	lockOut: string;
	safe: string;
	insuranceName: string;
	insuranceDate: string;
	insuranceNumber: string;
	notes: string;
};
