import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { admissionsTable } from "./admissions";

export const studentAccountsTable = pgTable("student_accounts", {
  id: serial("id").primaryKey(),
  admissionId: integer("admission_id").references(() => admissionsTable.id),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  classLevel: text("class_level").notNull(),
  resetToken: text("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type StudentAccount = typeof studentAccountsTable.$inferSelect;
