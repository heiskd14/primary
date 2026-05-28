import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { studentAccountsTable } from "./student_accounts";

export const schoolFeesTable = pgTable("school_fees", {
  id: serial("id").primaryKey(),
  studentAccountId: integer("student_account_id").references(() => studentAccountsTable.id, { onDelete: "cascade" }),
  term: text("term").notNull(),
  academicYear: text("academic_year").notNull(),
  classLevel: text("class_level").notNull(),
  feeType: text("fee_type").notNull(),
  amount: integer("amount").notNull().default(0),
  amountPaid: integer("amount_paid").notNull().default(0),
  dueDate: text("due_date").default(""),
  status: text("status").notNull().default("outstanding"),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SchoolFee = typeof schoolFeesTable.$inferSelect;
