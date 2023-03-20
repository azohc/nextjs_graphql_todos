import { TodoList } from '@/components/MyLists';
import { Todos } from '@/components/Todos';
import { MY_EMAIL_KEY } from '@/constants/email';
import { client } from '@/lib/client';
import { gql } from 'graphql-request';

type MyListPageMetadata = {
  params: { listId: string };
};

const GET_TODO_LISTS_QUERY = gql`
  query GetTODOLists($email: String!) {
    getTODOLists(email: $email) {
      id
      name
    }
  }
`;

export function generateMetadata({ params }: MyListPageMetadata) {
  return {
    title: `TODO List ${params.listId}`,
  };
}

type MyListPageProps = MyListPageMetadata;

export default async function MyListPage({
  params: { listId },
}: MyListPageProps) {
  const { getTODOLists } = await client.request<{ getTODOLists: TodoList[] }>(
    GET_TODO_LISTS_QUERY,
    {
      email: MY_EMAIL_KEY,
    },
  );

  return (
    <div className="flex align-center justify-center p-16 sm:p-8">
      <Todos
        listId={parseInt(listId)}
        // TODO swap with real data from query and
        // make sure to make the query from the server
        list={getTODOLists.map((tdl) => ({
          id: tdl.id,
          desc: 'desc todo',
          finished: false,
        }))}
      />
    </div>
  );
}
