import { Router } from "express";
import { db, admissionsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { insertAdmissionSchema } from "@workspace/db";

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
    res.status(201).json({
      ...admission,
      submittedAt: admission.submittedAt.toISOString(),
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

export default router;
