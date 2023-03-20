import { Todos } from '@/components/Todos';

type MyListPageMetadata = {
  params: { listId: string };
};

export function generateMetadata({ params }: MyListPageMetadata) {
  return {
    title: `TODO List ${params.listId}`,
  };
}

type MyListPageProps = MyListPageMetadata;

export default function MyListPage({ params: { listId } }: MyListPageProps) {
  // TODO fetch list from server

  return (
    <div className="flex align-center justify-center p-16 sm:p-8">
      <Todos
        listId={parseInt(listId)}
        // TODO swap with real data from query and
        // make sure to make the query from the server
        list={[
          { id: 1, desc: 'Study hard', finished: true },
          {
            id: 2,
            desc: 'Clean house',
            finished: false,
          },
          {
            id: 3,
            desc: 'Clean house',
            finished: false,
          },
        ]}
      />
    </div>
  );
}
