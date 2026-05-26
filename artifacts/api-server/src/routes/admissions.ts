import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, admissionsTable, studentAccountsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { insertAdmissionSchema } from "@workspace/db";
import { sendAdmissionNotification, sendStatusUpdateEmail, sendStudentCredentialsEmail } from "../mailer";

const router = Router();

function generateStudentEmail(firstName: string, lastName: string): string {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${clean(lastName)}.${clean(firstName)}@st.ttt.edu.ng`;
}

function generatePassword(firstName: string, lastName: string): string {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
  const fn = clean(firstName).slice(0, 3).padEnd(3, "x");
  const ln = clean(lastName).slice(-3).padStart(3, "x");
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  return `${fn}${ln}${digits}`;
}

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

    const updated = { ...results[0], submittedAt: results[0].submittedAt.toISOString() };
    res.json(updated);

    if (updated.parentEmail && ["reviewed", "accepted", "rejected"].includes(status)) {
      sendStatusUpdateEmail({
        childFirstName: updated.childFirstName,
        childLastName: updated.childLastName,
        classApplyingFor: updated.classApplyingFor,
        parentName: updated.parentName,
        parentEmail: updated.parentEmail,
        status: updated.status,
      }).catch((err) => {
        req.log.error({ err }, "Failed to send status update email");
      });
    }

    // When accepted: create student portal account and email credentials
    if (status === "accepted" && updated.parentEmail) {
      (async () => {
        try {
          const studentEmail = generateStudentEmail(updated.childFirstName, updated.childLastName);
          const plainPassword = generatePassword(updated.childFirstName, updated.childLastName);
          const passwordHash = await bcrypt.hash(plainPassword, 10);

          // Upsert: if account already exists (re-acceptance), skip creation
          const existing = await db
            .select({ id: studentAccountsTable.id })
            .from(studentAccountsTable)
            .where(eq(studentAccountsTable.admissionId, updated.id));

          if (existing.length === 0) {
            await db.insert(studentAccountsTable).values({
              admissionId: updated.id,
              email: studentEmail,
              passwordHash,
              firstName: updated.childFirstName,
              lastName: updated.childLastName,
              classLevel: updated.classApplyingFor,
            });

            await sendStudentCredentialsEmail({
              parentName: updated.parentName,
              parentEmail: updated.parentEmail,
              childFirstName: updated.childFirstName,
              childLastName: updated.childLastName,
              classLevel: updated.classApplyingFor,
              studentEmail,
              plainPassword,
            });
          }
        } catch (err) {
          // Log but don't crash — the status update already succeeded
          console.error("Failed to create student account or send credentials email:", err);
        }
      })();
    }
  } catch (err) {
    req.log.error({ err }, "Failed to update admission status");
    res.status(500).json({ error: "Failed to update admission status" });
  }
});

export default router;
