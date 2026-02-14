'use client';

import React from 'react';
import TodoList from '../../../components/TodoList';
import TodoCreate from '../../../components/TodoCreate';
import LoadingIconTwo from '../../../components/LoadingIconTwo';
import { useLogin } from '../../../hooks/app';
import { useProjects } from '../../../hooks/projects';
import { useTodos } from '../../../hooks/todos';

type TodosProps = {
	params: { id: string };
};

const Todos: React.FC<TodosProps> = ({ params }) => {
	const login = useLogin();
	const projectId = params.id;
	const { projects, isLoading: isProjectLoading } = useProjects(login.userId);
	const { todos, isLoading, add, update, remove } = useTodos(login.userId);
	const selectedProject = projects.filter(p => p.id === projectId)[0];

	if (isProjectLoading || isLoading) {
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
						<TodoCreate addTodo={add} projectId={projectId} />
					</div>
					<TodoList
						todos={todos}
						filterFn={t => t.projectId === projectId && !t.isDone}
						sortFn={(a, b) =>
							(b.creationTimestamp || 0) -
							(a.creationTimestamp || 0)
						}
						updateTodo={update}
						removeTodo={remove}
					/>
					{todos.filter(t => t.projectId === projectId && t.isDone)
						.length > 0 && (
						<h1 className="flex flex-col items-center max-w-4xl m-auto text-2xl font-bold mb-5">
							DONE
						</h1>
					)}
					<TodoList
						todos={todos}
						filterFn={t => t.projectId === projectId && t.isDone}
						sortFn={(a, b) =>
							(b.doneTimestamp || 0) - (a.doneTimestamp || 0)
						}
						updateTodo={update}
						removeTodo={remove}
					/>
				</>
			)}
		</>
	);
};

export default Todos;
