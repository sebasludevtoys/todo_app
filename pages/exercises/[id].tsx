import { useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { prisma } from "../../lib/prisma";
import { create } from "../../lib/db";

type Task = {
  id: string;
  todo: string;
  completed: boolean;
};
type CompletedTask = {
  id: string | undefined;
  taskId: string;
};
type Props = {
  tasks: Task[];
  exerciseId: string;
  user: string;
};

const Page = ({ tasks, exerciseId, user }: Props) => {
  const [state, setState] = useState(tasks);
  const [completed, setCompleted] = useState(false);
  const handleClick = async (id: string) => {
    const completed = state.find((completedTask) => id === completedTask.id);
    const newTasks = state.map((task) => {
      if (task.id === id) {
        const modifedTask = { ...task, completed: !task.completed };
        return modifedTask;
      }
      return task;
    });
    if (completed?.completed === false) {
      await create("POST", "tasks", { id });
    } else {
      await create("DELETE", "tasks", { id });
    }
    setState(newTasks);
  };

  const handleComplete = () => {
    create("DELETE", "exercise", { exerciseId, user });
  };

  useEffect(() => {
    const final: string[] = [];
    state.map((task) => {
      if (task.completed) final.push(task.id);
    });
    if (final.length === state.length) setCompleted(true);

    if (final.length === state.length - 1) setCompleted(false);
  }, [state]);

  return (
    <div className=' flex bg-slate-700 h-screen  justify-center items-center'>
      <div className='px-32 flex flex-col gap-y-5'>
        {state?.map((task) => (
          <div key={task.id} className='flex justify-between space-x-16'>
            <p className='text-slate-300'>{task.todo}</p>
            <input
              type='checkbox'
              checked={task.completed ? true : false}
              onChange={() => handleClick(task.id)}
            />
          </div>
        ))}
      </div>
      {completed ? (
        <div className='absolute bg-slate-200 '>
          <h2>Completed</h2>
          <button onClick={handleComplete}>Mark as Completed</button>
        </div>
      ) : null}
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const exerciseId = context.params.id;
  const user = session?.user?.email;

  const tasks = await prisma.task.findMany({
    where: { exerciseId: context.params.id },
    select: {
      id: true,
      todo: true,
    },
  });

  const userTasks = await prisma.completed_task.findMany({
    where: { user: { email: session?.user?.email } },
    select: { taskId: true },
  });
  const completedUserTask = tasks.map((task) => {
    const completedTask = userTasks.find(
      (userTask) => userTask.taskId === task.id
    );
    if (completedTask) {
      return { ...task, completed: true };
    }
    return { ...task, completed: false };
  });
  return {
    props: {
      tasks: completedUserTask,
      exerciseId,
      user,
    },
  };
}

export default Page;

// export async function getStaticPaths() {
//   const tasks = await prisma.task.groupBy({ by: ["exerciseId"] });
//   const paths = tasks.map((task) => {
//     return { params: { id: task.exerciseId } };
//   });
//   return {
//     paths,
//     fallback: false,
//   };
// }

// export async function getStaticProps(context: any) {
//   const tasks = await prisma.task.findMany({
//     where: { exerciseId: context.params.id },
//     select: {
//       id: true,
//       todo: true,
//     },
//   });
//   return {
//     props: {
//       tasks: tasks,
//     },
//   };
// }
