'use client';

import { useState } from 'react';
import { Heart } from '@/components/icons/Heart';
import { Close } from '@/components/icons/Close';
import { AddTodo } from '@/components/AddTodo';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';
import { MY_EMAIL_KEY } from '@/constants/email';

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

  const onRemoveHandler = (id: number) => {
    console.log(`Remove todo ${id}`);
  };

  const onFinishHandler = (id: number) => {
    console.log(`Mark todo ${id} as finished`);
  };

  return (
    <div>
      <h2 className="text-center text-5xl mb-10">My TODO list</h2>
      <ul>
        {todos.map((item) => (
          <li
            key={item.id}
            className="py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex justify-between items-center min-h-16"
          >
            <p className={item.finished ? 'line-through' : ''}>{item.desc}</p>
            {!item.finished && (
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-accent"
                  onClick={() => onFinishHandler(item.id)}
                >
                  <Heart />
                </button>
                <button
                  className="btn btn-square btn-error"
                  onClick={() => onRemoveHandler(item.id)}
                >
                  <Close />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <AddTodo onAdd={(desc) => void onAddHandler(desc)} />
    </div>
  );
};
