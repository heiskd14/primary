import { Router } from "express";
import { db, subjectsTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const subjects = await db.select().from(subjectsTable).orderBy(asc(subjectsTable.id));
    res.json(subjects);
  } catch (err) {
    req.log.error({ err }, "Failed to list subjects");
    res.status(500).json({ error: "Failed to list subjects" });
  }
});

export default router;
