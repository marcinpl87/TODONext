'use client';

import {
	useReducer,
	useContext,
	createContext,
	ReactNode,
	Dispatch,
} from 'react';
import LoginForm from './components/LoginForm';
import TopBar from './components/TopBar';
import { LOGIN_ACTIONS, type LoginState } from './types';

const LoginContext = createContext<LoginState>(false);
const LoginDispatchContext = createContext<Dispatch<LOGIN_ACTIONS>>(() => null);

const loginReducer = (state: LoginState, action: LOGIN_ACTIONS) => {
	switch (action) {
		case LOGIN_ACTIONS.LOGIN:
			return true;
		case LOGIN_ACTIONS.LOGOUT:
			return false;
		default:
			throw new Error(`Unknown action: ${JSON.stringify(action)}`);
	}
};

export const LoginProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(loginReducer, false);
	return (
		<LoginDispatchContext.Provider value={dispatch}>
			<LoginContext.Provider value={state}>
				{state ? (
					<>
						<TopBar />
						{children}
					</>
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
