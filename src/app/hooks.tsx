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
import { LOGIN_ACTIONS, type LoginDispatch, type LoginState } from './types';

const LoginContext = createContext<LoginState>({
	isLoggedIn: false,
	userId: '',
});
const LoginDispatchContext = createContext<Dispatch<LoginDispatch>>(() => null);

const loginReducer = (state: LoginState, loginDispatchData: LoginDispatch) => {
	switch (loginDispatchData.action) {
		case LOGIN_ACTIONS.LOGIN:
			return { isLoggedIn: true, userId: loginDispatchData.userId };
		case LOGIN_ACTIONS.LOGOUT:
			return { isLoggedIn: false, userId: '' };
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
	});
	return (
		<LoginDispatchContext.Provider value={dispatch}>
			<LoginContext.Provider value={state}>
				{state.isLoggedIn ? (
					<>
						<TopBar loginState={state} />
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

export const useLocalStorage = <T,>(key: string, callback: () => void) => {
	const getStoredArr = (): T => {
		const storedData = window.localStorage.getItem(key);
		return storedData ? JSON.parse(storedData) || [] : [];
	};
	const setStoredArr = (data: T): void => {
		window.localStorage.setItem(key, JSON.stringify(data));
		const loaderWrapper = document.querySelector('.loader');
		const loaderClass = 'loader--active';
		loaderWrapper?.classList.add(loaderClass);
		// TODO: Remove setTimeout and use a proper API call
		setTimeout(() => {
			callback();
			loaderWrapper?.classList.remove(loaderClass);
		}, 1500);
	};

	return [getStoredArr, setStoredArr] as const;
};
