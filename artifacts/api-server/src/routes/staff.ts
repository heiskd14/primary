import { Router } from "express";
import { db, staffTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { insertStaffSchema } from "@workspace/db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const department = req.query.department as string | undefined;
    let query = db.select().from(staffTable).orderBy(asc(staffTable.displayOrder));
    if (department) {
      query = query.where(eq(staffTable.department, department)) as typeof query;
    }
    const results = await query;
    res.json(results.map(r => ({ ...r, photoUrl: r.photoUrl })));
  } catch (err) {
    req.log.error({ err }, "Failed to list staff");
    res.status(500).json({ error: "Failed to list staff" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = insertStaffSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });
    const [member] = await db.insert(staffTable).values(parsed.data).returning();
    res.status(201).json(member);
  } catch (err) {
    req.log.error({ err }, "Failed to create staff member");
    res.status(500).json({ error: "Failed to create staff member" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = insertStaffSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });
    const results = await db.update(staffTable).set(parsed.data).where(eq(staffTable.id, id)).returning();
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(results[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update staff member");
    res.status(500).json({ error: "Failed to update staff member" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const results = await db.delete(staffTable).where(eq(staffTable.id, id)).returning();
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete staff member");
    res.status(500).json({ error: "Failed to delete staff member" });
  }
});

export default router;
