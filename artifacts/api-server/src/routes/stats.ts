import { Router } from "express";
import { db, scoresTable, factsTable } from "@workspace/db";
import { count, avg, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [totalResult] = await db.select({ count: count() }).from(scoresTable);
    const [avgResult] = await db.select({ avg: avg(scoresTable.percentage) }).from(scoresTable);
    const [factsResult] = await db.select({ count: count() }).from(factsTable);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const [todayResult] = await db
      .select({ count: count() })
      .from(scoresTable)
      .where(sql`${scoresTable.createdAt} >= ${todayStart}`);

    res.json({
      totalQuizzesTaken: totalResult.count,
      totalPlayersToday: todayResult.count,
      averageScore: avgResult.avg ? Math.round(Number(avgResult.avg)) : 0,
      totalFacts: factsResult.count,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;
