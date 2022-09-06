import { Exercise } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { create } from "../../lib/db";
import { prisma } from "../../lib/prisma";

type Props = {
  exercises: Exercise[];
};
const Page = (props: Props) => {
  const { exercises } = props;

  const handleClick = async (exerciseId: string) => {
    await create("POST", "exercise", { exerciseId });
  };

  return (
    <div className='gap-y-8 gap-x-8 grid grid-cols-5 px-12 py-8'>
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className='bg-slate-700 px-5 py-5 rounded-lg flex flex-col gap-y-8'
        >
          <h2 className='text-xl font-bold text-slate-200'>{exercise.title}</h2>
          <p className='text-base text-slate-300'>{exercise.description}</p>
          <Link href={`/exercises/${exercise.id}`}>
            <a
              className='bg-slate-400 py-3 px-5 rounded-sm text-center'
              onClick={() => handleClick(exercise.id)}
            >
              Start
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export async function getStaticProps() {
  const exercises = await prisma.exercise.findMany({
    select: {
      description: true,
      id: true,
      level: true,

      title: true,
      tasks: {
        select: {
          id: true,
          todo: true,
        },
      },
    },
  });
  return {
    props: {
      exercises,
    },
  };
}

export default Page;
