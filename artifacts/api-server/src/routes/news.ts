import { Router } from "express";
import { db, newsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { insertNewsSchema } from "@workspace/db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const category = req.query.category as string | undefined;

    let query = db.select().from(newsTable).orderBy(desc(newsTable.publishedAt));
    if (category) {
      query = query.where(eq(newsTable.category, category)) as typeof query;
    }
    const results = await query.limit(limit);
    res.json(results.map(r => ({ ...r, imageUrl: r.imageUrl, publishedAt: r.publishedAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Failed to list news");
    res.status(500).json({ error: "Failed to list news" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const results = await db.select().from(newsTable).where(eq(newsTable.id, id)).limit(1);
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    const r = results[0];
    res.json({ ...r, imageUrl: r.imageUrl, publishedAt: r.publishedAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to get news");
    res.status(500).json({ error: "Failed to get news" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = insertNewsSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data" });
    const [article] = await db.insert(newsTable).values(parsed.data).returning();
    res.status(201).json({ ...article, imageUrl: article.imageUrl, publishedAt: article.publishedAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to create news");
    res.status(500).json({ error: "Failed to create news" });
  }
});

export default router;
