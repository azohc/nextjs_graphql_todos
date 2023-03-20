'use client';

import Link from 'next/link';
import classNames from 'classnames';
import { CreateList } from '@/components/CreateList';
import { randomColor } from '@/utils/randomColor';
import { useState } from 'react';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';
import { MY_EMAIL_KEY } from '@/constants/email';

export type TodoList = {
  id: number;
  created_at: string;
  name: string;
  email: string;
};

const DELETE_TODO_LIST_MUTATION = gql`
  mutation DeleteTODOList($listId: Int!) {
    deleteTODOList(id: $listId)
  }
`;

type MyListsProps = {
  lists: TodoList[];
};

export const MyLists = ({ lists }: MyListsProps) => {
  const [todoLists, setTodoLists] = useState<TodoList[]>(lists);

  const onCreateHandler = (newTodoList: TodoList) => {
    setTodoLists([...todoLists, newTodoList]);
  };

  const onDeletedHandler = async (id: number) => {
    await client.request(DELETE_TODO_LIST_MUTATION, {
      listId: id,
      email: MY_EMAIL_KEY,
    });

    const targetList = todoLists.findIndex((tdl) => tdl.id === id);
    if (targetList === -1)
      throw new Error(
        `can not delete a list with id=${id} from ${JSON.stringify(todoLists)}`,
      );
    setTodoLists([
      ...todoLists.slice(0, targetList),
      ...todoLists.slice(targetList),
    ]);
  };

  return (
    <div className="flex flex-col gap-8 text-center">
      <h1 className="text-4xl">
        {todoLists.length > 0 ? 'My TODO lists' : 'No lists yet!'}
      </h1>
      {todoLists.length > 0 && (
        <ul>
          {todoLists.map(
            (item) =>
              item && (
                <li key={item.id} className="flex gap-1">
                  <Link
                    href={item.id.toString()}
                    className={classNames(
                      'py-2 px-4 bg-gray-900 rounded-lg mb-4 flex justify-between items-center min-h-16 text-black hover:scale-[1.02] transform transition duration-300 ease-in-out flex-1',
                      randomColor(),
                    )}
                  >
                    {item.name}
                  </Link>
                  <button onClick={() => void onDeletedHandler(item.id)}>
                    ❌
                  </button>
                </li>
              ),
          )}
        </ul>
      )}
      <CreateList onCreate={onCreateHandler} />
    </div>
  );
};
