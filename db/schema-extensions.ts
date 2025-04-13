import { pgTable, serial, integer, varchar, timestamp, decimal, text, boolean } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod"
import { users } from "./schema"

// Weight entries table
export const weightEntries = pgTable("weight_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  date: varchar("date", { length: 10 }).notNull(), // Store as YYYY-MM-DD string
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Body measurements table
export const bodyMeasurements = pgTable("body_measurements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  date: varchar("date", { length: 10 }).notNull(), // Store as YYYY-MM-DD string
  chest: decimal("chest", { precision: 5, scale: 2 }),
  waist: decimal("waist", { precision: 5, scale: 2 }),
  hips: decimal("hips", { precision: 5, scale: 2 }),
  arms: decimal("arms", { precision: 5, scale: 2 }),
  thighs: decimal("thighs", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
})

// Meal plans table
export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  mealId: integer("meal_id").references(() => users.id, { onDelete: "cascade" }),
  date: varchar("date", { length: 10 }).notNull(), // Store as YYYY-MM-DD string
  mealType: varchar("meal_type", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

// User profile table
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  age: integer("age"),
  gender: varchar("gender", { length: 20 }),
  height: integer("height"),
  activityLevel: varchar("activity_level", { length: 50 }),
  goal: varchar("goal", { length: 50 }),
  targetWeight: decimal("target_weight", { precision: 5, scale: 2 }),
  weeklyGoal: decimal("weekly_goal", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// User settings table
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  units: varchar("units", { length: 20 }).default("imperial"),
  theme: varchar("theme", { length: 20 }).default("light"),
  language: varchar("language", { length: 10 }).default("en"),
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Zod schemas for validation
export const insertWeightEntrySchema = createInsertSchema(weightEntries)
export const selectWeightEntrySchema = createSelectSchema(weightEntries)

export const insertBodyMeasurementSchema = createInsertSchema(bodyMeasurements)
export const selectBodyMeasurementSchema = createSelectSchema(bodyMeasurements)

export const insertMealPlanSchema = createInsertSchema(mealPlans)
export const selectMealPlanSchema = createSelectSchema(mealPlans)

export const insertUserProfileSchema = createInsertSchema(userProfiles)
export const selectUserProfileSchema = createSelectSchema(userProfiles)

export const insertUserSettingsSchema = createInsertSchema(userSettings)
export const selectUserSettingsSchema = createSelectSchema(userSettings)

// Custom types
export type WeightEntry = z.infer<typeof selectWeightEntrySchema>
export type NewWeightEntry = z.infer<typeof insertWeightEntrySchema>

export type BodyMeasurement = z.infer<typeof selectBodyMeasurementSchema>
export type NewBodyMeasurement = z.infer<typeof insertBodyMeasurementSchema>

export type MealPlan = z.infer<typeof selectMealPlanSchema>
export type NewMealPlan = z.infer<typeof insertMealPlanSchema>

export type UserProfile = z.infer<typeof selectUserProfileSchema>
export type NewUserProfile = z.infer<typeof insertUserProfileSchema>

export type UserSettings = z.infer<typeof selectUserSettingsSchema>
export type NewUserSettings = z.infer<typeof insertUserSettingsSchema>
