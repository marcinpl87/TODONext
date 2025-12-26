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
