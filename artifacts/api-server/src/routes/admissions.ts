import { Router } from "express";
import { db, admissionsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { insertAdmissionSchema } from "@workspace/db";
import { sendAdmissionNotification } from "../mailer";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const parsed = insertAdmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    }
    const [admission] = await db
      .insert(admissionsTable)
      .values(parsed.data)
      .returning();

    const result = { ...admission, submittedAt: admission.submittedAt.toISOString() };
    res.status(201).json(result);

    sendAdmissionNotification(result).catch((err) => {
      req.log.error({ err }, "Failed to send admission email notification");
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit admission");
    res.status(500).json({ error: "Failed to submit admission" });
  }
});

router.get("/", async (req, res) => {
  try {
    const results = await db
      .select()
      .from(admissionsTable)
      .orderBy(desc(admissionsTable.submittedAt));
    res.json(results.map(r => ({ ...r, submittedAt: r.submittedAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Failed to list admissions");
    res.status(500).json({ error: "Failed to list admissions" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body as { status?: string };
    if (!status || typeof status !== "string") return res.status(400).json({ error: "Invalid data" });
    const results = await db
      .update(admissionsTable)
      .set({ status })
      .where(eq(admissionsTable.id, id))
      .returning();
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ...results[0], submittedAt: results[0].submittedAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update admission status");
    res.status(500).json({ error: "Failed to update admission status" });
  }
});

export default router;
