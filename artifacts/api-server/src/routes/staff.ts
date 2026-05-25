import { Router } from "express";
import { db, staffTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const department = req.query.department as string | undefined;
    let query = db.select().from(staffTable).orderBy(asc(staffTable.displayOrder));
    if (department) {
      query = query.where(eq(staffTable.department, department)) as typeof query;
    }
    const results = await query;
    res.json(results.map(r => ({ ...r, photoUrl: r.photoUrl })));
  } catch (err) {
    req.log.error({ err }, "Failed to list staff");
    res.status(500).json({ error: "Failed to list staff" });
  }
});

export default router;
