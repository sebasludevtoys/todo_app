import { useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { prisma } from "../../lib/prisma";

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
  completedTasks: CompletedTask[];
};

const Page = ({ tasks }: Props) => {
  const [state, setState] = useState(tasks);

  async function create(id: string, method: "POST" | "DELETE") {
    try {
      fetch(
        `http://localhost:3000/api/tasks/${
          method === "POST" ? "create" : "delete"
        }`,
        {
          body: JSON.stringify({ id }),
          headers: {
            "Content-Type": "application/json",
          },
          method: method,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
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
      await create(id, "POST");
    } else {
      await create(id, "DELETE");
    }
    setState(newTasks);
  };

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
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

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
