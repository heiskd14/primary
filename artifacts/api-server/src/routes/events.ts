import { Router } from "express";
import { db, eventsTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const results = await db.select().from(eventsTable).orderBy(asc(eventsTable.date)).limit(limit);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Failed to list events");
    res.status(500).json({ error: "Failed to list events" });
  }
});

export default router;
