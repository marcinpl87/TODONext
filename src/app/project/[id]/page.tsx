'use client';

import React, { useEffect, useState } from 'react';
import TodoList from '../../../components/TodoList';
import TodoCreate from '../../../components/TodoCreate';
import LoadingIconTwo from '../../../components/LoadingIconTwo';
import { useLogin, useProjects, useTodos } from '../../../hooks';
import type { Todo } from '../../../types';

type TodosProps = {
	params: { id: string };
};

const Todos: React.FC<TodosProps> = ({ params }) => {
	const login = useLogin();
	const projectId = params.id;
	const { projects: lsProjects, isLoading: isProjectLoading } = useProjects();
	const { todos: lsTodos, isLoading: isTodoLoading } = useTodos();
	const [todosState, setTodosState] = useState<Todo[]>([]);
	const selectedProject = lsProjects.filter(p => p.id === projectId)[0];
	const addTodo = (todo: Todo, callback: () => void) => {
		const cache = [...todosState];
		setTodosState([todo, ...todosState]);
		callback();
		fetch('/api/todo', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId: login.userId,
				todo,
			}),
		}).catch(() => {
			setTodosState([...cache]); // revert back to the previous state
		});
	};
	const updateTodo = (
		updatedTodo: Todo,
		callback: () => void,
		errorCallback?: () => void,
	) => {
		const cache = [...todosState];
		setTodosState([
			...todosState.map(todo =>
				todo.id === updatedTodo.id ? updatedTodo : todo,
			),
		]);
		callback();
		fetch(`/api/todo/${updatedTodo.id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId: login.userId,
				todo: updatedTodo,
			}),
		}).catch(() => {
			setTodosState([...cache]); // revert back to the previous state
			errorCallback &&
				typeof errorCallback === 'function' &&
				errorCallback();
		});
	};
	const removeTodo = (id: string, title: string) => {
		if (
			confirm(
				`Are you sure you want to remove "${title}" (the TODO will be permanently deleted) ?`,
			)
		) {
			const cache = [...todosState];
			setTodosState([...todosState.filter(todo => todo.id !== id)]);
			fetch(`/api/todo/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'application/json',
				},
			}).catch(() => {
				setTodosState([...cache]); // revert back to the previous state
			});
		}
	};

	useEffect(() => {
		setTodosState(lsTodos);
	}, [lsTodos]);

	if (isProjectLoading || isTodoLoading) {
		return (
			<LoadingIconTwo className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	return (
		<>
			{projectId && (
				<>
					<div className="flex flex-col items-center max-w-4xl m-auto">
						<h1 className="text-2xl font-bold my-5">
							{selectedProject?.title}
						</h1>
						{selectedProject?.description && (
							<p className="mb-5 px-5 whitespace-pre-line">
								{selectedProject.description}
							</p>
						)}
						<TodoCreate addTodo={addTodo} projectId={projectId} />
					</div>
					<TodoList
						todos={todosState}
						filterFn={t => t.projectId === projectId && !t.isDone}
						sortFn={(a, b) =>
							(b.creationTimestamp || 0) -
							(a.creationTimestamp || 0)
						}
						updateTodo={updateTodo}
						removeTodo={removeTodo}
					/>
					{todosState.filter(
						t => t.projectId === projectId && t.isDone,
					).length > 0 && (
						<h1 className="flex flex-col items-center max-w-4xl m-auto text-2xl font-bold mb-5">
							DONE
						</h1>
					)}
					<TodoList
						todos={todosState}
						filterFn={t => t.projectId === projectId && t.isDone}
						sortFn={(a, b) =>
							(b.doneTimestamp || 0) - (a.doneTimestamp || 0)
						}
						updateTodo={updateTodo}
						removeTodo={removeTodo}
					/>
				</>
			)}
		</>
	);
};

export default Todos;
