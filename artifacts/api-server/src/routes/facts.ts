import { Router } from "express";
import { db, factsTable, subjectsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { GetRandomFactQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/random", async (req, res) => {
  try {
    const parsed = GetRandomFactQueryParams.safeParse({
      subjectId: req.query.subjectId ? Number(req.query.subjectId) : undefined,
    });

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid query params" });
    }

    const { subjectId } = parsed.data;

    let query = db
      .select({
        id: factsTable.id,
        subjectId: factsTable.subjectId,
        subjectName: subjectsTable.name,
        text: factsTable.text,
        emoji: factsTable.emoji,
      })
      .from(factsTable)
      .innerJoin(subjectsTable, eq(factsTable.subjectId, subjectsTable.id))
      .orderBy(sql`RANDOM()`)
      .limit(1);

    if (subjectId !== undefined) {
      query = query.where(eq(factsTable.subjectId, subjectId)) as typeof query;
    }

    const results = await query;
    if (results.length === 0) {
      return res.status(404).json({ error: "No facts found" });
    }
    res.json(results[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get random fact");
    res.status(500).json({ error: "Failed to get random fact" });
  }
});

router.get("/", async (req, res) => {
  try {
    const facts = await db
      .select({
        id: factsTable.id,
        subjectId: factsTable.subjectId,
        subjectName: subjectsTable.name,
        text: factsTable.text,
        emoji: factsTable.emoji,
      })
      .from(factsTable)
      .innerJoin(subjectsTable, eq(factsTable.subjectId, subjectsTable.id))
      .orderBy(factsTable.subjectId, factsTable.id);

    res.json(facts);
  } catch (err) {
    req.log.error({ err }, "Failed to list facts");
    res.status(500).json({ error: "Failed to list facts" });
  }
});

export default router;
