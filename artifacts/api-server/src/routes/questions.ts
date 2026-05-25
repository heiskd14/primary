import { Router } from "express";
import { db, questionsTable, subjectsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { ListQuestionsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const parsed = ListQuestionsQueryParams.safeParse({
      subjectId: req.query.subjectId ? Number(req.query.subjectId) : undefined,
      difficulty: req.query.difficulty,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid query params" });
    }

    const { subjectId, difficulty, limit } = parsed.data;

    const conditions = [];
    if (subjectId !== undefined) {
      conditions.push(eq(questionsTable.subjectId, subjectId));
    }
    if (difficulty !== undefined) {
      conditions.push(eq(questionsTable.difficulty, difficulty));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let query = db
      .select({
        id: questionsTable.id,
        subjectId: questionsTable.subjectId,
        subjectName: subjectsTable.name,
        text: questionsTable.text,
        options: questionsTable.options,
        correctIndex: questionsTable.correctIndex,
        difficulty: questionsTable.difficulty,
        explanation: questionsTable.explanation,
      })
      .from(questionsTable)
      .innerJoin(subjectsTable, eq(questionsTable.subjectId, subjectsTable.id))
      .where(whereClause)
      .orderBy(sql`RANDOM()`);

    const results = limit ? await query.limit(limit) : await query;
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Failed to list questions");
    res.status(500).json({ error: "Failed to list questions" });
  }
});

export default router;
