import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { prisma } from "../../../lib/prisma";

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  if (req.method === "POST") {
    try {
    const task = await prisma.completed_task.create({
      data:{
        task:{connect:{id:req.body.id}},
        user:{connect:{email:session.user?.email as string}},
      }
    })
    
    res.json(task);
    } catch (error) {
      res.json({ message: "error" });
    }
  }
}
