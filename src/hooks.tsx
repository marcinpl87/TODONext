'use client';

import {
	useReducer,
	useContext,
	createContext,
	ReactNode,
	Dispatch,
	useState,
	useEffect,
} from 'react';
import SiteHeader from './components/SiteHeader';
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
					<div className="relative w-full flex min-h-screen flex-col">
						<TopBar loginState={state} />
						<SiteHeader />
						<div className="flex-1">{children}</div>
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

export const useRedisStorage = <T,>(
	key: string,
): [boolean, T | [], (data: T, callback: () => void) => void] => {
	const endpoint = '/api/data';
	const [data, setData] = useState<T | []>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`${endpoint}?${new URLSearchParams({ key }).toString()}`,
				);
				const result = await response.json();
				setData(result?.data ? result.data || [] : []);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [key]);

	const setStoredArr = async (
		data: T,
		callback: () => void,
	): Promise<void> => {
		const loaderWrapper = document.querySelector('.loader');
		const loaderClass = 'loader--active';
		loaderWrapper?.classList.add(loaderClass);
		await fetch(endpoint, {
			method: 'POST',
			body: JSON.stringify({ key, data }),
		});
		callback();
		setData(data);
		loaderWrapper?.classList.remove(loaderClass);
	};

	return [isLoading, data, setStoredArr] as const;
};
