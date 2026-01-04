'use client';

import {
	useReducer,
	useContext,
	createContext,
	ReactNode,
	Dispatch,
} from 'react';
import SiteHeader from '../components/SiteHeader';
import LoginForm from '../components/LoginForm';
import {
	LOGIN_ACTIONS,
	type LoginState,
	type LoginDispatch,
} from '../types/app';

const LoginContext = createContext<LoginState>({
	isLoggedIn: false,
	userId: '',
	userName: '',
	users: [],
});
const LoginDispatchContext = createContext<Dispatch<LoginDispatch>>(() => null);

const loginReducer = (state: LoginState, loginDispatchData: LoginDispatch) => {
	switch (loginDispatchData.action) {
		case LOGIN_ACTIONS.LOGIN:
			return {
				isLoggedIn: true,
				userId: loginDispatchData.userId,
				userName: loginDispatchData.userName,
				users: loginDispatchData.users || [],
			};
		case LOGIN_ACTIONS.LOGOUT:
			return { isLoggedIn: false, userId: '', userName: '', users: [] };
		default:
			throw new Error(
				`Unknown action: ${JSON.stringify(loginDispatchData)}`,
			);
	}
};

export const LoginProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer<
		(state: LoginState, loginDispatchData: LoginDispatch) => LoginState
	>(loginReducer, {
		isLoggedIn: false,
		userId: '',
		userName: '',
		users: [],
	});

	return (
		<LoginDispatchContext.Provider value={dispatch}>
			<LoginContext.Provider value={state}>
				{state.isLoggedIn ? (
					<div className="relative w-full flex min-h-screen flex-col">
						<SiteHeader />
						<div className="flex-1 px-5">{children}</div>
					</div>
				) : (
					<LoginForm />
				)}
			</LoginContext.Provider>
		</LoginDispatchContext.Provider>
	);
};

export const LoginProviderWrapper = ({ children }: { children: ReactNode }) => {
	return <LoginProvider>{children}</LoginProvider>;
};

export const useLogin = () => useContext(LoginContext);

export const useDispatchLogin = () => useContext(LoginDispatchContext);
