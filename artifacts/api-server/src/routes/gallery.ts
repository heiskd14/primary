import { Router } from "express";
import { db, galleryTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

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

export default router;
