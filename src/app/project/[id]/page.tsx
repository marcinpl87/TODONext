'use client';

import React, { useReducer } from 'react';
import Link from 'next/link';
import 'react-datepicker/dist/react-datepicker.css';
import TodoList from '../../components/TodoList';
import TodoCreate from '../../components/TodoCreate';
import { useLocalStorage } from '../../hooks';
import { LS_KEY_PROJECTS, LS_KEY_TODOS } from '../../consts';
import type { Project, Todo } from '../../types';

type TodosProps = {
	params: { id: string };
};

const Todos: React.FC<TodosProps> = ({ params }) => {
	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const projectId = params.id;
	const [getLsTodos, setLsTodos] = useLocalStorage<Todo[]>(LS_KEY_TODOS);
	const [getLsProjects] = useLocalStorage<Project[]>(LS_KEY_PROJECTS);
	const selectedProject = getLsProjects().filter(p => p.id === projectId)[0];
	const addTodo = (todo: Todo, callback: () => void) => {
		setLsTodos([...getLsTodos(), todo], () => {
			callback();
			forceUpdate();
		});
	};
	const updateTodo = (updatedTodo: Todo, callback: () => void) => {
		setLsTodos(
			getLsTodos().map(todo =>
				todo.id === updatedTodo.id ? updatedTodo : todo,
			),
			() => {
				callback();
				forceUpdate();
			},
		);
	};
	const removeTodo = (id: string) => {
		setLsTodos(
			getLsTodos().filter(todo => todo.id !== id),
			forceUpdate,
		);
	};

	return (
		<>
			{projectId && (
				<>
					<h1 className="text-2xl font-bold underline mb-5">
						<Link href="/">🗂️</Link>
					</h1>
					<h1 className="text-2xl font-bold mb-5">
						{selectedProject?.title}
					</h1>
					{selectedProject?.description && (
						<p className="mb-5 px-5 whitespace-pre-line">
							{selectedProject.description}
						</p>
					)}
					<TodoCreate addTodo={addTodo} projectId={projectId} />
					<TodoList
						todos={getLsTodos()}
						filterFn={t => t.projectId === projectId && !t.isDone}
						sortFn={(a, b) =>
							(b.creationTimestamp || 0) -
							(a.creationTimestamp || 0)
						}
						updateTodo={updateTodo}
						removeTodo={removeTodo}
					/>
					{getLsTodos().filter(
						t => t.projectId === projectId && t.isDone,
					).length > 0 && (
						<h1 className="text-2xl font-bold mb-5">DONE</h1>
					)}
					<TodoList
						todos={getLsTodos()}
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
