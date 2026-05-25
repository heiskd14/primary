import { Router } from "express";
import { db, scoresTable, subjectsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { ListScoresQueryParams, SubmitScoreBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const parsed = ListScoresQueryParams.safeParse({
      subjectId: req.query.subjectId ? Number(req.query.subjectId) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid query params" });
    }

    const { subjectId, limit } = parsed.data;

    const conditions = [];
    if (subjectId !== undefined) {
      conditions.push(eq(scoresTable.subjectId, subjectId));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let query = db
      .select({
        id: scoresTable.id,
        playerName: scoresTable.playerName,
        subjectId: scoresTable.subjectId,
        subjectName: subjectsTable.name,
        score: scoresTable.score,
        totalQuestions: scoresTable.totalQuestions,
        percentage: scoresTable.percentage,
        createdAt: scoresTable.createdAt,
      })
      .from(scoresTable)
      .innerJoin(subjectsTable, eq(scoresTable.subjectId, subjectsTable.id))
      .where(whereClause)
      .orderBy(desc(scoresTable.percentage), desc(scoresTable.score));

    const results = limit ? await query.limit(limit) : await query.limit(50);
    res.json(results.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Failed to list scores");
    res.status(500).json({ error: "Failed to list scores" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = SubmitScoreBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid score data" });
    }

    const { playerName, subjectId, score, totalQuestions } = parsed.data;
    const percentage = Math.round((score / totalQuestions) * 100);

    const subject = await db.select().from(subjectsTable).where(eq(subjectsTable.id, subjectId)).limit(1);
    if (subject.length === 0) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const [newScore] = await db
      .insert(scoresTable)
      .values({ playerName, subjectId, score, totalQuestions, percentage })
      .returning();

    res.status(201).json({
      id: newScore.id,
      playerName: newScore.playerName,
      subjectId: newScore.subjectId,
      subjectName: subject[0].name,
      score: newScore.score,
      totalQuestions: newScore.totalQuestions,
      percentage: newScore.percentage,
      createdAt: newScore.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit score");
    res.status(500).json({ error: "Failed to submit score" });
  }
});

export default router;
