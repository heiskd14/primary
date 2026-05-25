import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const factsTable = pgTable("facts", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  text: text("text").notNull(),
  emoji: text("emoji").notNull(),
});

export const insertFactSchema = createInsertSchema(factsTable).omit({ id: true });
export type InsertFact = z.infer<typeof insertFactSchema>;
export type Fact = typeof factsTable.$inferSelect;
