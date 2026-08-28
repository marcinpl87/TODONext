'use client';

import { useContext, useState, createContext, ReactNode, Dispatch } from 'react';
import SiteHeader from '../components/SiteHeader';
import LoginForm from '../components/LoginForm';
import LoadingIconTwo from '../components/LoadingIconTwo';
import { authClient } from '../lib/auth-client';
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

export const LoginProvider = ({ children }: { children: ReactNode }) => {
	const { data: session, isPending } = authClient.useSession();
	const [hasResolvedSession, setHasResolvedSession] = useState(false);
	// A tab return refetches the session and sets isPending again while logged out.
	// Only the first check should replace the page; later ones must leave the form mounted.
	if (!hasResolvedSession && !isPending) {
		setHasResolvedSession(true);
	}

	const dispatch: Dispatch<LoginDispatch> = loginDispatchData => {
		if (loginDispatchData.action === LOGIN_ACTIONS.LOGOUT) {
			void authClient.signOut();
		}
	};

	const state: LoginState = session?.user
		? {
				isLoggedIn: true,
				userId: session.user.id,
				userName: session.user.name,
				users: [{ id: session.user.id, name: session.user.name }],
			}
		: {
				isLoggedIn: false,
				userId: '',
				userName: '',
				users: [],
			};

	if (!hasResolvedSession) {
		return (
			<LoadingIconTwo className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

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
