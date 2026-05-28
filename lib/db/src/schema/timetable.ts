import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";

export const timetableTable = pgTable("timetable", {
  id: serial("id").primaryKey(),
  classLevel: text("class_level").notNull(),
  timeSlot: text("time_slot").notNull(),
  monday: text("monday").default(""),
  tuesday: text("tuesday").default(""),
  wednesday: text("wednesday").default(""),
  thursday: text("thursday").default(""),
  friday: text("friday").default(""),
  timetableType: text("timetable_type").notNull().default("class"),
  displayOrder: integer("display_order").notNull().default(0),
  isBreak: integer("is_break").notNull().default(0),
});

export type TimetableRow = typeof timetableTable.$inferSelect;
