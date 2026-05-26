import { Router } from "express";
import { db, eventsTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { insertEventSchema } from "@workspace/db";

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

router.post("/", async (req, res) => {
  try {
    const parsed = insertEventSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });
    const [event] = await db.insert(eventsTable).values(parsed.data).returning();
    res.status(201).json(event);
  } catch (err) {
    req.log.error({ err }, "Failed to create event");
    res.status(500).json({ error: "Failed to create event" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = insertEventSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });
    const results = await db.update(eventsTable).set(parsed.data).where(eq(eventsTable.id, id)).returning();
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(results[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update event");
    res.status(500).json({ error: "Failed to update event" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const results = await db.delete(eventsTable).where(eq(eventsTable.id, id)).returning();
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete event");
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
