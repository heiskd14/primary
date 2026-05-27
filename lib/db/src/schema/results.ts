import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { studentAccountsTable } from "./student_accounts";

export const resultsTable = pgTable("results", {
  id: serial("id").primaryKey(),
  studentAccountId: integer("student_account_id").notNull().references(() => studentAccountsTable.id, { onDelete: "cascade" }),
  term: text("term").notNull(),
  academicYear: text("academic_year").notNull(),
  classLevel: text("class_level").notNull(),
  subject: text("subject").notNull(),
  caScore: integer("ca_score").default(0),
  examScore: integer("exam_score").default(0),
  total: integer("total").default(0),
  grade: text("grade").default(""),
  remark: text("remark").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Result = typeof resultsTable.$inferSelect;
