import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const schoolSubjectsTable = pgTable("school_subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull().default("📚"),
  description: text("description").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
});

export const insertSchoolSubjectSchema = createInsertSchema(schoolSubjectsTable).omit({ id: true });
export type InsertSchoolSubject = z.infer<typeof insertSchoolSubjectSchema>;
export type SchoolSubject = typeof schoolSubjectsTable.$inferSelect;

export const schoolClubsTable = pgTable("school_clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  timeSlot: text("time_slot").notNull(),
  yearGroup: text("year_group").notNull(),
  icon: text("icon").notNull().default("⭐"),
  displayOrder: integer("display_order").notNull().default(0),
});

export const insertSchoolClubSchema = createInsertSchema(schoolClubsTable).omit({ id: true });
export type InsertSchoolClub = z.infer<typeof insertSchoolClubSchema>;
export type SchoolClub = typeof schoolClubsTable.$inferSelect;
