'use client';

import React, { useReducer } from 'react';
import Link from 'next/link';
import '../../globals.css';
import 'react-datepicker/dist/react-datepicker.css';
import TodoForm from '../../components/TodoForm';
import TodoItem from '../../components/TodoItem';
import { useLocalStorage } from '../../hooks';
import { LS_KEY_PROJECTS, LS_KEY_TODOS } from '../../consts';
import type { Project, Todo } from '../../types';

type TodosProps = {
	params: { id: string };
};

const Todos: React.FC<TodosProps> = ({ params }) => {
	const [, forceUpdate] = useReducer(x => x + 1, 0);

	const projectId = params.id;

	const [getLsTodos, setLsTodos] = useLocalStorage<Todo[]>(
		LS_KEY_TODOS,
		forceUpdate,
	);
	const [getLsProjects] = useLocalStorage<Project[]>(
		LS_KEY_PROJECTS,
		forceUpdate,
	);
	const selectedProject = getLsProjects().filter(p => p.id === projectId)[0];

	const addTodo = (todo: Todo) => {
		setLsTodos([...getLsTodos(), todo]);
	};

	const updateTodo = (updatedTodo: Todo) => {
		setLsTodos(
			getLsTodos().map(todo =>
				todo.id === updatedTodo.id ? updatedTodo : todo,
			),
		);
	};

	const removeTodo = (id: string) => {
		setLsTodos(getLsTodos().filter(todo => todo.id !== id));
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
						<p className="mb-5">{selectedProject.description}</p>
					)}
					<TodoForm addTodo={addTodo} projectId={projectId} />
					<ul className="w-full flex flex-col items-center">
						{getLsTodos()
							.filter(t => t.projectId === projectId && !t.isDone)
							.sort(
								(a, b) =>
									(b.creationTimestamp || 0) -
									(a.creationTimestamp || 0),
							)
							.map(todo => (
								<TodoItem
									key={todo.id}
									todo={todo}
									updateTodo={updateTodo}
									removeTodo={removeTodo}
								/>
							))}
					</ul>
					{getLsTodos().filter(
						t => t.projectId === projectId && t.isDone,
					).length > 0 && (
						<h1 className="text-2xl font-bold mb-5">DONE</h1>
					)}
					<ul className="w-full flex flex-col items-center">
						{getLsTodos()
							.filter(t => t.projectId === projectId && t.isDone)
							.sort(
								(a, b) =>
									(b.doneTimestamp || 0) -
									(a.doneTimestamp || 0),
							)
							.map(todo => (
								<TodoItem
									key={todo.id}
									todo={todo}
									updateTodo={updateTodo}
									removeTodo={removeTodo}
								/>
							))}
					</ul>
				</>
			)}
		</>
	);
};

export default Todos;
