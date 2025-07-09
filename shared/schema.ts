import { pgTable, text, serial, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const automations = pgTable("automations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  badge: varchar("badge", { length: 20 }),
  apps: text("apps").array().notNull(),
  trigger: text("trigger").notNull(),
  action: text("action").notNull(),
  proTip: text("pro_tip").notNull(),
  videoId: text("video_id"),
  popularity: integer("popularity").default(0),
});

export const insertAutomationSchema = createInsertSchema(automations).omit({
  id: true,
});

export type InsertAutomation = z.infer<typeof insertAutomationSchema>;
export type Automation = typeof automations.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
