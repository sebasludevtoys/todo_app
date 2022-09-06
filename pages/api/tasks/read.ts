import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { prisma } from "../../../lib/prisma";

export default async function read(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  if (req.method === "GET") {
    try {
      const tasks = await prisma.completed_task.findMany({
        where: { user: { email: session.user?.email } },
        select: { taskId: true},
      });
      res.send(tasks);
    } catch (error) {
      res.json({ message: "error" });
    }
  }
}
