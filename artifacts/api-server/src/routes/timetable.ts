import { Router } from "express";
import { db, timetableTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const DEFAULT_TIMETABLE = [
  { timeSlot: "7:30 – 8:00",   monday: "Devotion & Assembly", tuesday: "Devotion & Assembly", wednesday: "Devotion & Assembly", thursday: "Devotion & Assembly", friday: "Devotion & Assembly", displayOrder: 0, isBreak: 0 },
  { timeSlot: "8:00 – 9:00",   monday: "English Language",    tuesday: "Mathematics",         wednesday: "Basic Science",      thursday: "English Language",   friday: "Social Studies",     displayOrder: 1, isBreak: 0 },
  { timeSlot: "9:00 – 10:00",  monday: "Mathematics",         tuesday: "English Language",    wednesday: "Mathematics",        thursday: "CRS",                friday: "Mathematics",        displayOrder: 2, isBreak: 0 },
  { timeSlot: "10:00 – 10:20", monday: "BREAK",               tuesday: "BREAK",               wednesday: "BREAK",              thursday: "BREAK",              friday: "BREAK",              displayOrder: 3, isBreak: 1 },
  { timeSlot: "10:20 – 11:20", monday: "Social Studies",      tuesday: "Basic Science",       wednesday: "Cultural Arts",      thursday: "Yoruba Language",    friday: "Computer Studies",   displayOrder: 4, isBreak: 0 },
  { timeSlot: "11:20 – 12:20", monday: "CRS",                 tuesday: "Vocational Apt.",     wednesday: "Physical Edu.",      thursday: "Mathematics",        friday: "English Language",   displayOrder: 5, isBreak: 0 },
  { timeSlot: "12:20 – 1:00",  monday: "LUNCH",               tuesday: "LUNCH",               wednesday: "LUNCH",              thursday: "LUNCH",              friday: "LUNCH",              displayOrder: 6, isBreak: 1 },
  { timeSlot: "1:00 – 2:00",   monday: "Yoruba Language",     tuesday: "Cultural Arts",       wednesday: "English Language",   thursday: "Computer Studies",   friday: "Basic Science",      displayOrder: 7, isBreak: 0 },
  { timeSlot: "2:00 – 3:00",   monday: "Computer Studies",    tuesday: "Social Studies",      wednesday: "CRS",                thursday: "Physical Edu.",      friday: "Vocational Apt.",    displayOrder: 8, isBreak: 0 },
];

/* GET /api/timetable?classLevel=Primary 1 */
router.get("/", async (req, res) => {
  try {
    const { classLevel } = req.query as { classLevel?: string };
    if (!classLevel) return res.status(400).json({ error: "classLevel required" });

    const rows = await db
      .select()
      .from(timetableTable)
      .where(eq(timetableTable.classLevel, classLevel))
      .orderBy(timetableTable.displayOrder);

    if (rows.length === 0) {
      return res.json(DEFAULT_TIMETABLE.map(r => ({ ...r, id: null, classLevel })));
    }
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Get timetable failed");
    res.status(500).json({ error: "Failed to fetch timetable" });
  }
});

/* PUT /api/timetable
   body: { classLevel, rows: [{timeSlot, monday, tuesday, wednesday, thursday, friday, displayOrder, isBreak}] }
*/
router.put("/", async (req, res) => {
  try {
    const { classLevel, rows } = req.body as {
      classLevel: string;
      rows: { timeSlot: string; monday: string; tuesday: string; wednesday: string; thursday: string; friday: string; displayOrder: number; isBreak: number }[];
    };
    if (!classLevel) return res.status(400).json({ error: "classLevel required" });

    await db.delete(timetableTable).where(eq(timetableTable.classLevel, classLevel));

    if (rows.length > 0) {
      await db.insert(timetableTable).values(
        rows.map(({ timeSlot, monday, tuesday, wednesday, thursday, friday, displayOrder, isBreak }) => ({
          classLevel, timeSlot,
          monday: monday ?? "", tuesday: tuesday ?? "", wednesday: wednesday ?? "",
          thursday: thursday ?? "", friday: friday ?? "",
          displayOrder: displayOrder ?? 0, isBreak: isBreak ?? 0,
        })),
      );
    }

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Save timetable failed");
    res.status(500).json({ error: "Failed to save timetable" });
  }
});

export default router;
