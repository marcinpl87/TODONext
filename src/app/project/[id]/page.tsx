'use client';

import React, { useReducer } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import TodoList from '../../../components/TodoList';
import TodoCreate from '../../../components/TodoCreate';
import LoadingIcon from '@/components/LoadingIcon';
import { useLogin, useRedisStorage } from '../../../hooks';
import { LS_KEY_PROJECTS, LS_KEY_TODOS } from '../../../consts';
import type { Project, Todo } from '../../../types';

type TodosProps = {
	params: { id: string };
};

const Todos: React.FC<TodosProps> = ({ params }) => {
	const login = useLogin();
	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const projectId = params.id;
	const [isTodoLoading, lsTodos, setLsTodos] =
		useRedisStorage<Todo[]>(LS_KEY_TODOS);
	const [isProjectLoading, lsProjects] =
		useRedisStorage<Project[]>(LS_KEY_PROJECTS);

	if (isProjectLoading || isTodoLoading) {
		return (
			<LoadingIcon className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	const selectedProject = lsProjects.filter(p => p.id === projectId)[0];
	const addTodo = (todo: Todo, callback: () => void) => {
		setLsTodos([...lsTodos, todo], () => {
			callback();
			forceUpdate();
		});
		fetch('/api/todo', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId: login.userId,
				todo,
			}),
		});
	};
	const updateTodo = (updatedTodo: Todo, callback: () => void) => {
		setLsTodos(
			lsTodos.map(todo =>
				todo.id === updatedTodo.id ? updatedTodo : todo,
			),
			() => {
				callback();
				forceUpdate();
			},
		);
		fetch(`/api/todo/${updatedTodo.id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId: login.userId,
				todo: updatedTodo,
			}),
		});
	};
	const removeTodo = (id: string, title: string) => {
		if (
			confirm(
				`Are you sure you want to remove "${title}" (the TODO will be permanently deleted) ?`,
			)
		) {
			setLsTodos(
				lsTodos.filter(todo => todo.id !== id),
				forceUpdate,
			);
		}
		fetch(`/api/todo/${id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		});
	};

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
						todos={lsTodos}
						filterFn={t => t.projectId === projectId && !t.isDone}
						sortFn={(a, b) =>
							(b.creationTimestamp || 0) -
							(a.creationTimestamp || 0)
						}
						updateTodo={updateTodo}
						removeTodo={removeTodo}
					/>
					{lsTodos.filter(t => t.projectId === projectId && t.isDone)
						.length > 0 && (
						<h1 className="flex flex-col items-center max-w-4xl m-auto text-2xl font-bold mb-5">
							DONE
						</h1>
					)}
					<TodoList
						todos={lsTodos}
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
