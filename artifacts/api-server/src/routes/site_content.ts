import { Router } from "express";
import { db, siteContentTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const results = await db.select().from(siteContentTable);
    const map: Record<string, string> = {};
    for (const row of results) map[row.key] = row.value;
    res.json(map);
  } catch (err) {
    req.log.error({ err }, "Failed to get site content");
    res.status(500).json({ error: "Failed to get site content" });
  }
});

router.put("/:key", async (req, res) => {
  try {
    const key = req.params.key;
    const { value } = req.body as { value?: string };
    if (typeof value !== "string") return res.status(400).json({ error: "value is required" });
    const existing = await db.select().from(siteContentTable).where(eq(siteContentTable.key, key)).limit(1);
    let result;
    if (existing.length > 0) {
      const [r] = await db.update(siteContentTable).set({ value }).where(eq(siteContentTable.key, key)).returning();
      result = r;
    } else {
      const [r] = await db.insert(siteContentTable).values({ key, value }).returning();
      result = r;
    }
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to upsert site content");
    res.status(500).json({ error: "Failed to upsert site content" });
  }
});

export default router;
