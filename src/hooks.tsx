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
import {
	Todo,
	Project,
	LOGIN_ACTIONS,
	type LoginState,
	type LoginDispatch,
} from './types';

const LoginContext = createContext<LoginState>({
	isLoggedIn: false,
	userId: '',
	userName: '',
});
const LoginDispatchContext = createContext<Dispatch<LoginDispatch>>(() => null);

const loginReducer = (state: LoginState, loginDispatchData: LoginDispatch) => {
	switch (loginDispatchData.action) {
		case LOGIN_ACTIONS.LOGIN:
			return {
				isLoggedIn: true,
				userId: loginDispatchData.userId,
				userName: loginDispatchData.userName,
			};
		case LOGIN_ACTIONS.LOGOUT:
			return { isLoggedIn: false, userId: '', userName: '' };
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

export const useProjects = () => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const fetchProjects = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch('/api/project');
				if (!response.ok) {
					throw new Error('Failed to fetch projects');
				}
				const data = await response.json();
				setProjects(data?.data || []);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('An unknown error occurred');
				}
			} finally {
				setIsLoading(false);
			}
		};
		fetchProjects();
	}, []);

	return { projects, isLoading, error };
};

export const useTodos = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const fetchTodos = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch('/api/todo');
				if (!response.ok) {
					throw new Error('Failed to fetch todos');
				}
				const data = await response.json();
				setTodos(data?.data || []);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('An unknown error occurred');
				}
			} finally {
				setIsLoading(false);
			}
		};
		fetchTodos();
	}, []);

	return { todos, isLoading, error };
};
