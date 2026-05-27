import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { studentAccountsTable } from "./student_accounts";

export const attendanceTable = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentAccountId: integer("student_account_id").notNull().references(() => studentAccountsTable.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  term: text("term").notNull(),
  academicYear: text("academic_year").notNull(),
  classLevel: text("class_level").notNull(),
  status: text("status").notNull().default("present"),
  remark: text("remark").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Attendance = typeof attendanceTable.$inferSelect;
