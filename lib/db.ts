import { prisma } from "./prisma";

export const createTask = async (id: string) => {
  await prisma.completed_task.create({
    data: {
      taskId: id,
    },
  });
};

export const deleteTask = async (id: string) => {
  await prisma.completed_task.deleteMany({
    where: {
      taskId: id,
    },
  });
};
