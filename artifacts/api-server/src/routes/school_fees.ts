import { Router } from "express";
import { db, schoolFeesTable, studentAccountsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { classLevel, term, academicYear } = req.query as Record<string, string>;
    if (!classLevel || !term || !academicYear)
      return res.status(400).json({ error: "classLevel, term, academicYear required" });

    const fees = await db
      .select({
        fee: schoolFeesTable,
        student: { id: studentAccountsTable.id, firstName: studentAccountsTable.firstName, lastName: studentAccountsTable.lastName },
      })
      .from(schoolFeesTable)
      .leftJoin(studentAccountsTable, eq(schoolFeesTable.studentAccountId, studentAccountsTable.id))
      .where(and(
        eq(schoolFeesTable.classLevel, classLevel),
        eq(schoolFeesTable.term, term),
        eq(schoolFeesTable.academicYear, academicYear),
      ));

    res.json(fees);
  } catch (err) {
    req.log.error({ err }, "Get school fees failed");
    res.status(500).json({ error: "Failed to fetch school fees" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { studentAccountId, term, academicYear, classLevel, feeType, amount, amountPaid, dueDate, notes } = req.body as {
      studentAccountId?: number; term: string; academicYear: string; classLevel: string;
      feeType: string; amount: number; amountPaid?: number; dueDate?: string; notes?: string;
    };
    if (!term || !academicYear || !classLevel || !feeType)
      return res.status(400).json({ error: "term, academicYear, classLevel, feeType required" });

    const paid = amountPaid ?? 0;
    const status = paid >= amount ? "paid" : paid > 0 ? "partial" : "outstanding";

    const [row] = await db.insert(schoolFeesTable).values({
      studentAccountId: studentAccountId ?? null,
      term, academicYear, classLevel, feeType,
      amount: amount ?? 0, amountPaid: paid,
      dueDate: dueDate ?? "", notes: notes ?? "", status,
    }).returning();
    res.status(201).json(row);
  } catch (err) {
    req.log.error({ err }, "Create fee failed");
    res.status(500).json({ error: "Failed to create fee record" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { feeType, amount, amountPaid, dueDate, notes } = req.body as {
      feeType?: string; amount?: number; amountPaid?: number; dueDate?: string; notes?: string;
    };
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (feeType !== undefined) updates.feeType = feeType;
    if (amount !== undefined) updates.amount = amount;
    if (amountPaid !== undefined) {
      updates.amountPaid = amountPaid;
      const amt = amount ?? 0;
      updates.status = amountPaid >= amt ? "paid" : amountPaid > 0 ? "partial" : "outstanding";
    }
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (notes !== undefined) updates.notes = notes;
    await db.update(schoolFeesTable).set(updates).where(eq(schoolFeesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Update fee failed");
    res.status(500).json({ error: "Failed to update fee" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(schoolFeesTable).where(eq(schoolFeesTable.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Delete fee failed");
    res.status(500).json({ error: "Failed to delete fee" });
  }
});

export default router;
