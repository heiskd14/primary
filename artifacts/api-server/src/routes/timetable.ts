import { Router } from "express";
import { db, timetableTable, studentAccountsTable, admissionsTable } from "@workspace/db";
import { eq, and, isNotNull } from "drizzle-orm";
import { sendTimetableUploadedEmail } from "../mailer";

const router = Router();

const DEFAULT_TIMETABLE = [
  { timeSlot: "8:00 – 8:20",   monday: "Devotion & Assembly",    tuesday: "Devotion & Assembly",    wednesday: "Devotion & Assembly",  thursday: "Devotion & Assembly",   friday: "Devotion & Assembly",     timetableType: "class", displayOrder: 0,  isBreak: 0 },
  { timeSlot: "8:20 – 9:20",   monday: "English Language",        tuesday: "Mathematics",             wednesday: "Basic Science",         thursday: "English Language",       friday: "Social Studies",           timetableType: "class", displayOrder: 1,  isBreak: 0 },
  { timeSlot: "9:20 – 10:20",  monday: "Mathematics",             tuesday: "English Language",        wednesday: "Mathematics",           thursday: "CRS",                    friday: "Mathematics",              timetableType: "class", displayOrder: 2,  isBreak: 0 },
  { timeSlot: "10:20 – 10:40", monday: "BREAK",                   tuesday: "BREAK",                   wednesday: "BREAK",                 thursday: "BREAK",                  friday: "BREAK",                    timetableType: "class", displayOrder: 3,  isBreak: 1 },
  { timeSlot: "10:40 – 11:40", monday: "Social Studies",          tuesday: "Basic Science",           wednesday: "Cultural Arts",         thursday: "Yoruba Language",         friday: "Computer Studies",         timetableType: "class", displayOrder: 4,  isBreak: 0 },
  { timeSlot: "11:40 – 12:40", monday: "CRS",                     tuesday: "Vocational Apt.",         wednesday: "Physical Edu.",         thursday: "Mathematics",             friday: "English Language",         timetableType: "class", displayOrder: 5,  isBreak: 0 },
  { timeSlot: "12:40 – 1:20",  monday: "LUNCH",                   tuesday: "LUNCH",                   wednesday: "LUNCH",                 thursday: "LUNCH",                  friday: "LUNCH",                    timetableType: "class", displayOrder: 6,  isBreak: 1 },
  { timeSlot: "1:20 – 2:20",   monday: "Yoruba Language",         tuesday: "Cultural Arts",           wednesday: "English Language",      thursday: "Computer Studies",        friday: "Basic Science",            timetableType: "class", displayOrder: 7,  isBreak: 0 },
  { timeSlot: "2:20 – 3:20",   monday: "Computer Studies",        tuesday: "Social Studies",          wednesday: "CRS",                   thursday: "Physical Edu.",           friday: "Vocational Apt.",          timetableType: "class", displayOrder: 8,  isBreak: 0 },
  { timeSlot: "3:20 – 4:20",   monday: "Art & Craft",             tuesday: "Music & Drama",           wednesday: "Library / Reading",     thursday: "Handwriting",             friday: "Story Time",               timetableType: "class", displayOrder: 9,  isBreak: 0 },
  { timeSlot: "4:20 – 5:00",   monday: "Closing / Home Reading",  tuesday: "Closing / Home Reading",  wednesday: "Closing / Home Reading",thursday: "Closing / Home Reading", friday: "Assembly & Dismissal",     timetableType: "class", displayOrder: 10, isBreak: 0 },
];

async function notifyParentsTimetable(classLevel: string) {
  try {
    const parents = await db
      .select({ parentEmail: admissionsTable.parentEmail, parentName: admissionsTable.parentName, firstName: studentAccountsTable.firstName, lastName: studentAccountsTable.lastName })
      .from(studentAccountsTable)
      .leftJoin(admissionsTable, eq(studentAccountsTable.admissionId, admissionsTable.id))
      .where(and(eq(studentAccountsTable.classLevel, classLevel), isNotNull(admissionsTable.parentEmail)));
    for (const p of parents) {
      if (!p.parentEmail) continue;
      sendTimetableUploadedEmail({ parentName: p.parentName ?? "Parent/Guardian", parentEmail: p.parentEmail, childFirstName: p.firstName, classLevel }).catch(() => {});
    }
  } catch { /* silent fail */ }
}

router.get("/", async (req, res) => {
  try {
    const { classLevel, timetableType = "class" } = req.query as { classLevel?: string; timetableType?: string };
    if (!classLevel) return res.status(400).json({ error: "classLevel required" });

    const rows = await db
      .select()
      .from(timetableTable)
      .where(and(eq(timetableTable.classLevel, classLevel), eq(timetableTable.timetableType, timetableType)))
      .orderBy(timetableTable.displayOrder);

    if (rows.length === 0 && timetableType === "class") {
      return res.json(DEFAULT_TIMETABLE.map(r => ({ ...r, id: null, classLevel })));
    }
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Get timetable failed");
    res.status(500).json({ error: "Failed to fetch timetable" });
  }
});

router.put("/", async (req, res) => {
  try {
    const { classLevel, timetableType = "class", rows } = req.body as {
      classLevel: string; timetableType?: string;
      rows: { timeSlot: string; monday: string; tuesday: string; wednesday: string; thursday: string; friday: string; displayOrder: number; isBreak: number }[];
    };
    if (!classLevel) return res.status(400).json({ error: "classLevel required" });

    await db.delete(timetableTable).where(and(eq(timetableTable.classLevel, classLevel), eq(timetableTable.timetableType, timetableType)));

    if (rows.length > 0) {
      await db.insert(timetableTable).values(
        rows.map(({ timeSlot, monday, tuesday, wednesday, thursday, friday, displayOrder, isBreak }) => ({
          classLevel, timetableType, timeSlot,
          monday: monday ?? "", tuesday: tuesday ?? "", wednesday: wednesday ?? "",
          thursday: thursday ?? "", friday: friday ?? "",
          displayOrder: displayOrder ?? 0, isBreak: isBreak ?? 0,
        })),
      );
    }

    if (timetableType === "class") notifyParentsTimetable(classLevel);
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Save timetable failed");
    res.status(500).json({ error: "Failed to save timetable" });
  }
});

export default router;
