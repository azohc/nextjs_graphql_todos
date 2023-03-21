'use client';

import { useState } from 'react';
import { Check } from '@/components/icons/Check';
import { Cross } from '@/components/icons/Cross';
import { AddTodo } from '@/components/AddTodo';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';
import { MY_EMAIL_KEY } from '@/constants/email';
import { Reorder } from 'framer-motion';

export type Todo = {
  id: number;
  desc: string;
  finished: boolean;
};

type TodosProps = {
  listId: number;
  list: Todo[];
};

const ADD_TODO_MUTATION = gql`
  mutation AddTODO($listId: Int!, $desc: String!) {
    addTODO(listId: $listId, desc: $desc) {
      id
    }
  }
`;

export const REMOVE_TODO_MUTATION = gql`
  mutation RemoveTODO($todoId: Int!, $listId: Int!) {
    removeTODO(id: $todoId, listId: $listId)
  }
`;

const FINISH_TODO_MUTATION = gql`
  mutation FinishTODO($todoId: Int!, $listId: Int!) {
    finishTODO(id: $todoId, listId: $listId) {
      id
    }
  }
`;

export const Todos = ({ list = [], listId }: TodosProps) => {
  const [todos, setTodos] = useState<Todo[]>(list);

  const onAddHandler = async (desc: string) => {
    const { addTODO } = await client.request<{ addTODO: { id: number } }>(
      ADD_TODO_MUTATION,
      {
        listId: Number(listId),
        desc,
        email: MY_EMAIL_KEY,
      },
    );
    setTodos([...todos, { id: addTODO.id, desc, finished: false }]);
  };

  const onRemoveHandler = async (id: number) => {
    const targetTodo = todos.findIndex((t) => t.id === id);
    if (targetTodo === -1)
      throw new Error(
        `can not delete a todo with id=${id} from ${JSON.stringify(todos)}`,
      );

    await client.request(REMOVE_TODO_MUTATION, {
      todoId: id,
      listId: Number(listId),
      email: MY_EMAIL_KEY,
    });

    setTodos([...todos.slice(0, targetTodo), ...todos.slice(targetTodo + 1)]);
  };

  const onFinishHandler = async (id: number) => {
    const targetTodo = todos.findIndex((t) => t.id === id);
    if (targetTodo === -1)
      throw new Error(
        `can not finish a todo with id=${id} from ${JSON.stringify(todos)}`,
      );

    await client.request(FINISH_TODO_MUTATION, {
      todoId: id,
      listId: Number(listId),
      email: MY_EMAIL_KEY,
    });

    setTodos([
      ...todos.slice(0, targetTodo),
      {
        ...todos[targetTodo],
        finished: true,
      },
      ...todos.slice(targetTodo + 1),
    ]);
  };

  return (
    <div>
      <h2 className="text-center text-5xl mb-10">My TODO list</h2>
      <Reorder.Group axis="y" values={todos} onReorder={setTodos}>
        {todos.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex justify-between items-center min-h-16 text-white"
          >
            <p className={item.finished ? 'line-through text-neutral-500' : ''}>
              {item.desc}
            </p>
            {!item.finished && (
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-accent"
                  onClick={() => void onFinishHandler(item.id)}
                >
                  <Check />
                </button>
                <button
                  className="btn btn-square btn-error"
                  onClick={() => void onRemoveHandler(item.id)}
                >
                  <Cross />
                </button>
              </div>
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <AddTodo onAdd={(desc) => void onAddHandler(desc)} />
    </div>
  );
};
