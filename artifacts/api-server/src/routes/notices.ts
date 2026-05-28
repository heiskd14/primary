import { Router } from "express";
import { db, noticesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(noticesTable).orderBy(desc(noticesTable.publishedAt));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Get notices failed");
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, body, type, publishedAt } = req.body as { title: string; body: string; type?: string; publishedAt?: string };
    if (!title || !body) return res.status(400).json({ error: "title and body required" });
    const [row] = await db.insert(noticesTable).values({
      title, body,
      type: type ?? "general",
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    }).returning();
    res.status(201).json(row);
  } catch (err) {
    req.log.error({ err }, "Create notice failed");
    res.status(500).json({ error: "Failed to create notice" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, body, type, publishedAt } = req.body as { title?: string; body?: string; type?: string; publishedAt?: string };
    const updates: Partial<{ title: string; body: string; type: string; publishedAt: Date }> = {};
    if (title) updates.title = title;
    if (body) updates.body = body;
    if (type) updates.type = type;
    if (publishedAt) updates.publishedAt = new Date(publishedAt);
    await db.update(noticesTable).set(updates).where(eq(noticesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Update notice failed");
    res.status(500).json({ error: "Failed to update notice" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(noticesTable).where(eq(noticesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Delete notice failed");
    res.status(500).json({ error: "Failed to delete notice" });
  }
});

export default router;
