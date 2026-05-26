import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const admissionsTable = pgTable("admissions", {
  id: serial("id").primaryKey(),
  // Child details
  childFirstName: text("child_first_name").notNull(),
  childLastName: text("child_last_name").notNull(),
  childDob: text("child_dob").notNull(),
  childGender: text("child_gender").notNull(),
  classApplyingFor: text("class_applying_for").notNull(),
  previousSchool: text("previous_school"),
  // Parent/Guardian details
  parentName: text("parent_name").notNull(),
  parentRelationship: text("parent_relationship").notNull(),
  parentPhone: text("parent_phone").notNull(),
  parentPhone2: text("parent_phone2"),
  parentEmail: text("parent_email"),
  parentAddress: text("parent_address").notNull(),
  // Additional
  howDidYouHear: text("how_did_you_hear"),
  additionalInfo: text("additional_info"),
  // Status
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAdmissionSchema = createInsertSchema(admissionsTable).omit({
  id: true,
  status: true,
  submittedAt: true,
});
export type InsertAdmission = z.infer<typeof insertAdmissionSchema>;
export type Admission = typeof admissionsTable.$inferSelect;
