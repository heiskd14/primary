import { Router } from "express";
import { db, resultsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

function calcGrade(total: number): string {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  return "F";
}
function calcRemark(grade: string): string {
  return ({ A: "Excellent", B: "Very Good", C: "Good", D: "Pass", F: "Fail" } as Record<string, string>)[grade] ?? "";
}

/* GET /api/results?classLevel=Primary 1&term=First Term&academicYear=2025/2026 */
router.get("/", async (req, res) => {
  try {
    const { classLevel, term, academicYear } = req.query as Record<string, string>;
    if (!classLevel || !term || !academicYear)
      return res.status(400).json({ error: "classLevel, term, academicYear required" });
    const rows = await db
      .select()
      .from(resultsTable)
      .where(and(
        eq(resultsTable.classLevel, classLevel),
        eq(resultsTable.term, term),
        eq(resultsTable.academicYear, academicYear),
      ));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Get results failed");
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

/* GET /api/results/student/:id?term=...&academicYear=... */
router.get("/student/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { term, academicYear } = req.query as Record<string, string>;
    const conditions: ReturnType<typeof eq>[] = [eq(resultsTable.studentAccountId, id)];
    if (term) conditions.push(eq(resultsTable.term, term));
    if (academicYear) conditions.push(eq(resultsTable.academicYear, academicYear));
    const rows = await db.select().from(resultsTable).where(and(...conditions));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Get student results failed");
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

/* PUT /api/results/bulk
   body: [{ studentAccountId, term, academicYear, classLevel, subjects: [{subject, caScore, examScore}] }]
*/
router.put("/bulk", async (req, res) => {
  try {
    const entries = req.body as {
      studentAccountId: number;
      term: string;
      academicYear: string;
      classLevel: string;
      subjects: { subject: string; caScore: number; examScore: number }[];
    }[];

    for (const entry of entries) {
      const { studentAccountId, term, academicYear, classLevel, subjects } = entry;

      await db.delete(resultsTable).where(
        and(
          eq(resultsTable.studentAccountId, studentAccountId),
          eq(resultsTable.term, term),
          eq(resultsTable.academicYear, academicYear),
        ),
      );

      if (subjects.length > 0) {
        const rows = subjects
          .filter(s => s.subject)
          .map(s => {
            const ca = Number(s.caScore) || 0;
            const exam = Number(s.examScore) || 0;
            const total = ca + exam;
            const grade = calcGrade(total);
            return { studentAccountId, term, academicYear, classLevel, subject: s.subject, caScore: ca, examScore: exam, total, grade, remark: calcRemark(grade) };
          });
        if (rows.length > 0) await db.insert(resultsTable).values(rows);
      }
    }

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Bulk save results failed");
    res.status(500).json({ error: "Failed to save results" });
  }
});

export default router;
