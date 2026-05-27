import { Router } from "express";
import { db, attendanceTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

/* GET /api/attendance?classLevel=Primary 1&date=2026-05-27&term=...&academicYear=... */
router.get("/", async (req, res) => {
  try {
    const { classLevel, date, term, academicYear } = req.query as Record<string, string>;
    if (!classLevel) return res.status(400).json({ error: "classLevel required" });

    const conditions: ReturnType<typeof eq>[] = [eq(attendanceTable.classLevel, classLevel)];
    if (date) conditions.push(eq(attendanceTable.date, date));
    if (term) conditions.push(eq(attendanceTable.term, term));
    if (academicYear) conditions.push(eq(attendanceTable.academicYear, academicYear));

    const rows = await db.select().from(attendanceTable).where(and(...conditions));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Get attendance failed");
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

/* GET /api/attendance/student/:id?term=...&academicYear=... */
router.get("/student/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { term, academicYear } = req.query as Record<string, string>;

    const conditions: ReturnType<typeof eq>[] = [eq(attendanceTable.studentAccountId, id)];
    if (term) conditions.push(eq(attendanceTable.term, term));
    if (academicYear) conditions.push(eq(attendanceTable.academicYear, academicYear));

    const rows = await db.select().from(attendanceTable).where(and(...conditions));

    const total = rows.length;
    const present = rows.filter(r => r.status === "present").length;
    const absent = rows.filter(r => r.status === "absent").length;
    const late = rows.filter(r => r.status === "late").length;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : null;

    res.json({ rows, summary: { total, present, absent, late, percentage } });
  } catch (err) {
    req.log.error({ err }, "Get student attendance failed");
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

/* PUT /api/attendance/bulk
   body: { date, term, academicYear, classLevel, entries: [{studentAccountId, status, remark?}] }
*/
router.put("/bulk", async (req, res) => {
  try {
    const { date, term, academicYear, classLevel, entries } = req.body as {
      date: string;
      term: string;
      academicYear: string;
      classLevel: string;
      entries: { studentAccountId: number; status: string; remark?: string }[];
    };
    if (!date || !classLevel || !entries?.length)
      return res.status(400).json({ error: "date, classLevel, entries required" });

    for (const entry of entries) {
      await db.delete(attendanceTable).where(
        and(
          eq(attendanceTable.studentAccountId, entry.studentAccountId),
          eq(attendanceTable.date, date),
        ),
      );
    }

    await db.insert(attendanceTable).values(
      entries.map(e => ({
        studentAccountId: e.studentAccountId,
        date,
        term,
        academicYear,
        classLevel,
        status: e.status,
        remark: e.remark ?? "",
      })),
    );

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Bulk save attendance failed");
    res.status(500).json({ error: "Failed to save attendance" });
  }
});

export default router;
