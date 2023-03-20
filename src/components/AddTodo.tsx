import { FormEvent } from 'react';

type AddTODOFormProps = {
  onAdd(desc: string): void;
};

export const AddTodo = ({ onAdd }: AddTODOFormProps) => {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const desc = (event.currentTarget.desc as HTMLInputElement).value;
    onAdd(desc);
  };

  return (
    <form onSubmit={onSubmit} className="md:min-w-[500px] sm:min-w-0 w-full">
      <div>
        <input
          type="text"
          name="desc"
          id="desc"
          placeholder="Write a TODO..."
          className="input w-full"
        />
      </div>
      <button type="submit" className="btn btn-secondary w-full mt-4">
        Add TODO
      </button>
    </form>
  );
};
