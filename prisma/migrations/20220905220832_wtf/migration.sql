/*
  Warnings:

  - You are about to drop the `Started_Exercise` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `Completed_task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Started_Exercise";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Completed_task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Completed_task_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Completed_task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Completed_task" ("id", "taskId", "userId") SELECT "id", "taskId", "userId" FROM "Completed_task";
DROP TABLE "Completed_task";
ALTER TABLE "new_Completed_task" RENAME TO "Completed_task";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
