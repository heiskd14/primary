import { Router } from "express";
import { db, galleryTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { insertGallerySchema } from "@workspace/db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 30;
    const category = req.query.category as string | undefined;
    let query = db.select().from(galleryTable).orderBy(desc(galleryTable.createdAt));
    if (category) {
      query = query.where(eq(galleryTable.category, category)) as typeof query;
    }
    const results = await query.limit(limit);
    res.json(results.map(r => ({ ...r, imageUrl: r.imageUrl, createdAt: r.createdAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Failed to list gallery");
    res.status(500).json({ error: "Failed to list gallery" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = insertGallerySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });
    const [item] = await db.insert(galleryTable).values(parsed.data).returning();
    res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to create gallery item");
    res.status(500).json({ error: "Failed to create gallery item" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const parsed = insertGallerySchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });
    const results = await db.update(galleryTable).set(parsed.data).where(eq(galleryTable.id, id)).returning();
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    const r = results[0];
    res.json({ ...r, createdAt: r.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update gallery item");
    res.status(500).json({ error: "Failed to update gallery item" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const results = await db.delete(galleryTable).where(eq(galleryTable.id, id)).returning();
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete gallery item");
    res.status(500).json({ error: "Failed to delete gallery item" });
  }
});

export default router;
