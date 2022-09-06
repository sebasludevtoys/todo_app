import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { prisma } from "../../../lib/prisma";

export default async function del(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }
  
    if (req.method === "DELETE") {
      const task = await prisma.started_Exercise.deleteMany({
        where:{
            user:{
                email:req.body.user
            },
            exercise:{
                id:req.body.exerciseId
            }
        }
    })
    const completed_exercise = await prisma.completed_Exercise.create({
        data:{
            user:{
                connect:{
                    email:req.body.user
                }
            },
            exercise:{
                connect:{
                    id:req.body.exerciseId
                }
            }
        }
    })
      res.send({task,completed_exercise})
    } else {
      console.log("Note could not be created");
    }
  }
  