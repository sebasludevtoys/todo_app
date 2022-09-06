import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
// email:session.user?.email
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  const exercises = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    include:{completed_tasks:{select:{taskId:true}}}
  });
  return res.json(exercises);
}
