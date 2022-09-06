import type { NextPage } from "next";
import { prisma } from "../lib/prisma";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import Link from "next/link";

type Exercise = {
  description: string;
  title: string;
};

type CompletedExercise = {
  exercise: { title: string };
  exerciseId: string;
};
type CompletedExercises = {
  data: CompletedExercise[];
};

type UserExercise = {
  exercise: Exercise;
  exerciseId: string;
};

export default function Home({
  exercises,
  completedExercise,
}: {
  exercises: UserExercise[];
  completedExercise: CompletedExercise[];
}) {
  console.log(completedExercise);
  return (
    <div className='relative h-screen bg-gray-800 flex flex-col justify-center items-center px-8'>
      <h2 className='text-3xl text-slate-200 mb-5'>Started</h2>
      <div className='grid gap-y-5'>
        {exercises.map((exercise) => (
          <div
            key={exercise.exerciseId}
            className='bg-slate-400 py-5 px-5 flex flex-col gap-y-4'
          >
            <h3 className='text-xl font-bold'>{exercise.exercise.title}</h3>
            <p>{exercise.exercise.description}</p>
            <Link href={`exercises/${exercise.exerciseId}`}>
              <a className='bg-slate-300 px-5 py-2 w-fit rounded-md'>
                Continue
              </a>
            </Link>
          </div>
        ))}
      </div>
      <h2 className='text-3xl text-slate-200 mb-5'>Completed</h2>
      {completedExercise.map((exercise) => (
        <div key={exercise.exerciseId}>
          <h3>{exercise.exercise.title}</h3>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const exercises = await prisma.started_Exercise.findMany({
    where: {
      user: {
        email: session?.user?.email,
      },
    },
    include: {
      exercise: {
        select: {
          title: true,
          description: true,
        },
      },
    },
  });

  const completed_exercises = await prisma.completed_Exercise.findMany({
    where: { user: { email: session?.user?.email } },
    include: {
      exercise: {
        select: {
          title: true,
        },
      },
    },
  });

  return {
    props: { exercises, completedExercise: completed_exercises }, // will be passed to the page component as props
  };
}
