import { Router } from "express";
import { db, schoolSubjectsTable, schoolClubsTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { insertSchoolSubjectSchema, insertSchoolClubSchema } from "@workspace/db";

const router = Router();

router.get("/subjects", async (req, res) => {
  try {
    const results = await db.select().from(schoolSubjectsTable).orderBy(asc(schoolSubjectsTable.displayOrder));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Failed to list subjects");
    res.status(500).json({ error: "Failed to list subjects" });
  }
});

router.post("/subjects", async (req, res) => {
  try {
    const parsed = insertSchoolSubjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });
    const [item] = await db.insert(schoolSubjectsTable).values(parsed.data).returning();
    res.status(201).json(item);
  } catch (err) {
    req.log.error({ err }, "Failed to create subject");
    res.status(500).json({ error: "Failed to create subject" });
  }
});

router.patch("/subjects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = insertSchoolSubjectSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });
    const results = await db.update(schoolSubjectsTable).set(parsed.data).where(eq(schoolSubjectsTable.id, id)).returning();
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(results[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update subject");
    res.status(500).json({ error: "Failed to update subject" });
  }
});

router.delete("/subjects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const results = await db.delete(schoolSubjectsTable).where(eq(schoolSubjectsTable.id, id)).returning();
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete subject");
    res.status(500).json({ error: "Failed to delete subject" });
  }
});

router.get("/clubs", async (req, res) => {
  try {
    const results = await db.select().from(schoolClubsTable).orderBy(asc(schoolClubsTable.displayOrder));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Failed to list clubs");
    res.status(500).json({ error: "Failed to list clubs" });
  }
});

router.post("/clubs", async (req, res) => {
  try {
    const parsed = insertSchoolClubSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });
    const [item] = await db.insert(schoolClubsTable).values(parsed.data).returning();
    res.status(201).json(item);
  } catch (err) {
    req.log.error({ err }, "Failed to create club");
    res.status(500).json({ error: "Failed to create club" });
  }
});

router.patch("/clubs/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = insertSchoolClubSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });
    const results = await db.update(schoolClubsTable).set(parsed.data).where(eq(schoolClubsTable.id, id)).returning();
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(results[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update club");
    res.status(500).json({ error: "Failed to update club" });
  }
});

router.delete("/clubs/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const results = await db.delete(schoolClubsTable).where(eq(schoolClubsTable.id, id)).returning();
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete club");
    res.status(500).json({ error: "Failed to delete club" });
  }
});

export default router;
