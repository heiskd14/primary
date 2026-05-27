import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db, studentAccountsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sendPasswordResetEmail } from "../mailer";

const router = Router();

const CLASS_ORDER = ["Creche", "Toddler", "Nursery 1", "Nursery 2", "Kindergarten", "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5"];

/* POST /api/student/login */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) return res.status(400).json({ error: "Email and password are required." });

    const [account] = await db
      .select()
      .from(studentAccountsTable)
      .where(eq(studentAccountsTable.email, email.toLowerCase().trim()));

    if (!account) return res.status(401).json({ error: "Invalid email or password." });

    const valid = await bcrypt.compare(password, account.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid email or password." });

    res.json({
      id: account.id,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      classLevel: account.classLevel,
    });
  } catch (err) {
    req.log.error({ err }, "Student login failed");
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

/* POST /api/student/forgot-password */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body as { email?: string };
    if (!email) return res.status(400).json({ error: "Email is required." });

    const [account] = await db
      .select()
      .from(studentAccountsTable)
      .where(eq(studentAccountsTable.email, email.toLowerCase().trim()));

    res.json({ message: "If that email exists, a reset link has been sent." });

    if (!account) return;

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await db
      .update(studentAccountsTable)
      .set({ resetToken: token, resetTokenExpires: expires })
      .where(eq(studentAccountsTable.id, account.id));

    sendPasswordResetEmail({ firstName: account.firstName, lastName: account.lastName, email: account.email, token }).catch((err) => {
      req.log.error({ err }, "Failed to send password reset email");
    });
  } catch (err) {
    req.log.error({ err }, "Forgot password failed");
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

/* POST /api/student/reset-password */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body as { token?: string; newPassword?: string };
    if (!token || !newPassword) return res.status(400).json({ error: "Token and new password are required." });
    if (newPassword.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });

    const [account] = await db.select().from(studentAccountsTable).where(eq(studentAccountsTable.resetToken, token));

    if (!account) return res.status(400).json({ error: "Invalid or expired reset link." });
    if (!account.resetTokenExpires || account.resetTokenExpires < new Date()) {
      return res.status(400).json({ error: "This reset link has expired. Please request a new one." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.update(studentAccountsTable).set({ passwordHash, resetToken: null, resetTokenExpires: null }).where(eq(studentAccountsTable.id, account.id));

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    req.log.error({ err }, "Reset password failed");
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

/* GET /api/student/list?classLevel=Primary 1 */
router.get("/list", async (req, res) => {
  try {
    const { classLevel } = req.query as { classLevel?: string };
    if (!classLevel) return res.status(400).json({ error: "classLevel required" });

    const students = await db
      .select({
        id: studentAccountsTable.id,
        firstName: studentAccountsTable.firstName,
        lastName: studentAccountsTable.lastName,
        email: studentAccountsTable.email,
        classLevel: studentAccountsTable.classLevel,
      })
      .from(studentAccountsTable)
      .where(eq(studentAccountsTable.classLevel, classLevel))
      .orderBy(studentAccountsTable.lastName, studentAccountsTable.firstName);

    res.json(students);
  } catch (err) {
    req.log.error({ err }, "Get student list failed");
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

/* POST /api/student/promote — promotes all students in a class to the next class */
router.post("/promote", async (req, res) => {
  try {
    const { classLevel } = req.body as { classLevel?: string };
    if (!classLevel) return res.status(400).json({ error: "classLevel required" });

    const idx = CLASS_ORDER.indexOf(classLevel);
    if (idx === -1) return res.status(400).json({ error: "Unknown class level" });
    if (idx === CLASS_ORDER.length - 1) return res.status(400).json({ error: "Already at final class level" });

    const nextLevel = CLASS_ORDER[idx + 1];

    await db.update(studentAccountsTable).set({ classLevel: nextLevel }).where(eq(studentAccountsTable.classLevel, classLevel));

    res.json({ ok: true, from: classLevel, to: nextLevel });
  } catch (err) {
    req.log.error({ err }, "Promote class failed");
    res.status(500).json({ error: "Failed to promote class" });
  }
});

export default router;
