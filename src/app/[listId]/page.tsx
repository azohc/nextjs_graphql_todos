import { Todos } from '@/components/Todos';
import { MY_EMAIL_KEY } from '@/constants/email';
import { client } from '@/lib/client';
import { gql } from 'graphql-request';

type MyListPageMetadata = {
  params: { listId: string };
};

export function generateMetadata({ params }: MyListPageMetadata) {
  return {
    title: `TODO List ${params.listId}`,
  };
}

const GET_TODOS_QUERY = gql`
  query GetTODOs($listId: Int!) {
    getTODOs(listId: $listId) {
      id
      created_at
      desc
      todo_list_id
      finished
    }
  }
`;

export interface Todos {
  id: number;
  created_at: string;
  desc: string;
  todo_list_id: number;
  finished: boolean;
}

type MyListPageProps = MyListPageMetadata;

export default async function MyListPage({
  params: { listId },
}: MyListPageProps) {
  const { getTODOs } = await client.request<{ getTODOs: Todos[] }>(
    GET_TODOS_QUERY,
    {
      listId: Number(listId),
      email: MY_EMAIL_KEY,
    },
  );

  return (
    <div className="flex align-center justify-center p-16 sm:p-8">
      <Todos
        listId={parseInt(listId)}
        list={getTODOs.map((t) => ({
          id: t.id,
          desc: t.desc,
          finished: t.finished,
        }))}
      />
    </div>
  );
}
