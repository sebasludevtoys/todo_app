import { PrismaClient } from "@prisma/client";
import data from './data/data.json'

const prisma = new PrismaClient();

const run = async () => {
    const newTodo = await Promise.all(
      data.map(async (exercise) => {
        return prisma.exercise.create({
          data: {
            title: exercise.title,
            description: exercise.description,
            level:exercise.level,
            tasks:{
                create:exercise.tasks.map(task => ({
                    todo:task.todo
                }))
            }
          },
        });
      })
    );
  };
  
  run()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });