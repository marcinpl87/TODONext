'use client';

import React from 'react';
import TodoItem from './TodoItem';
import type { Todo } from '../types';

type TodoListProps = {
	todos: Todo[];
	filterFn: (todo: Todo) => boolean;
	sortFn: (a: Todo, b: Todo) => number;
	updateTodo: (todo: Todo, callback: () => void) => void;
	removeTodo: (id: string) => void;
};

const TodoList: React.FC<TodoListProps> = ({
	todos,
	filterFn,
	sortFn,
	updateTodo,
	removeTodo,
}) => (
	<div className="w-full flex flex-col items-center">
		{todos
			.filter(filterFn)
			.sort(sortFn)
			.map(todo => (
				<TodoItem
					key={todo.id}
					todo={todo}
					updateTodo={updateTodo}
					removeTodo={removeTodo}
				/>
			))}
	</div>
);

export default TodoList;
