import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  date,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  age: integer("age"),
  gender: varchar("gender", { length: 50 }),
  height: integer("height"),
  targetWeight: integer("target_weight"),
  activityLevel: varchar("activity_level", { length: 50 }),
  weeklyGoal: varchar("weekly_goal", { length: 50 }),
  measurementUnit: varchar("measurement_unit", { length: 20 }).default(
    "imperial",
  ),
  theme: varchar("theme", { length: 20 }).default("light"),
  language: varchar("language", { length: 10 }).default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Meals table (reusable meal templates)
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  unit: varchar("unit", { length: 50 }).default("serving"),
  description: text("description"),
  calories: numeric("calories", { precision: 10, scale: 2 }).notNull(),
  protein: numeric("protein", { precision: 10, scale: 2 }),
  carbs: numeric("carbs", { precision: 10, scale: 2 }),
  fat: numeric("fat", { precision: 10, scale: 2 }),
  tags: text("tags").array(),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Food entries table (daily food log)
export const foodEntries = pgTable("food_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  mealId: integer("meal_id").references(() => meals.id, {
    onDelete: "set null",
  }),
  foodName: varchar("food_name", { length: 255 }).notNull(),
  mealType: varchar("meal_type", { length: 50 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).default("1"),
  calories: numeric("calories", { precision: 10, scale: 2 }).notNull(),
  protein: numeric("protein", { precision: 10, scale: 2 }).notNull(),
  carbs: numeric("carbs", { precision: 10, scale: 2 }).notNull(),
  fat: integer("fat").notNull(),
  entryDate: varchar("entry_date", { length: 10 }).notNull(), // Store as YYYY-MM-DD string
  entryTime: varchar("entry_time", { length: 8 }).notNull(), // Store as HH:MM:SS string
  createdAt: timestamp("created_at").defaultNow(),
});

// Nutrition goals table
export const nutritionGoals = pgTable("nutrition_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  calorieGoal: integer("calorie_goal").notNull(),
  proteinGoal: integer("protein_goal"),
  carbsGoal: integer("carbs_goal"),
  fatGoal: integer("fat_goal"),
  waterGoal: integer("water_goal"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Weight entries table
export const weightEntries = pgTable("weight_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  weight: numeric("weight", { precision: 5, scale: 1 }).notNull(),
  entryDate: date("entry_date").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Body measurements table
export const bodyMeasurements = pgTable("body_measurements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  chest: numeric("chest", { precision: 5, scale: 1 }),
  waist: numeric("waist", { precision: 5, scale: 1 }),
  hips: numeric("hips", { precision: 5, scale: 1 }),
  arms: numeric("arms", { precision: 5, scale: 1 }),
  thighs: numeric("thighs", { precision: 5, scale: 1 }),
  entryDate: date("entry_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Meal plans table
export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  mealId: integer("meal_id").references(() => meals.id, {
    onDelete: "cascade",
  }),
  mealType: varchar("meal_type", { length: 50 }).notNull(),
  planDate: date("plan_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User settings table
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  dailyReminders: boolean("daily_reminders").default(true),
  goalUpdates: boolean("goal_updates").default(true),
  weeklySummary: boolean("weekly_summary").default(true),
  appUpdates: boolean("app_updates").default(false),
  newsletter: boolean("newsletter").default(false),
  breakfastReminderTime: varchar("breakfast_reminder_time", {
    length: 5,
  }).default("08:00"),
  lunchReminderTime: varchar("lunch_reminder_time", { length: 5 }).default(
    "12:30",
  ),
  dinnerReminderTime: varchar("dinner_reminder_time", { length: 5 }).default(
    "18:30",
  ),
  dataStorage: boolean("data_storage").default(true),
  cloudBackup: boolean("cloud_backup").default(true),
  analytics: boolean("analytics").default(true),
  personalization: boolean("personalization").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertMealSchema = createInsertSchema(meals);
export const selectMealSchema = createSelectSchema(meals);

export const insertFoodEntrySchema = createInsertSchema(foodEntries);
export const selectFoodEntrySchema = createSelectSchema(foodEntries);

export const insertNutritionGoalSchema = createInsertSchema(nutritionGoals);
export const selectNutritionGoalSchema = createSelectSchema(nutritionGoals);

export const insertWeightEntrySchema = createInsertSchema(weightEntries);
export const selectWeightEntrySchema = createSelectSchema(weightEntries);

export const insertBodyMeasurementSchema = createInsertSchema(bodyMeasurements);
export const selectBodyMeasurementSchema = createSelectSchema(bodyMeasurements);

export const insertMealPlanSchema = createInsertSchema(mealPlans);
export const selectMealPlanSchema = createSelectSchema(mealPlans);

export const insertUserSettingsSchema = createInsertSchema(userSettings);
export const selectUserSettingsSchema = createSelectSchema(userSettings);

// Custom types
export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;

export type Meal = z.infer<typeof selectMealSchema>;
export type NewMeal = z.infer<typeof insertMealSchema>;

export type FoodEntry = z.infer<typeof selectFoodEntrySchema>;
export type NewFoodEntry = z.infer<typeof insertFoodEntrySchema>;

export type NutritionGoal = z.infer<typeof selectNutritionGoalSchema>;
export type NewNutritionGoal = z.infer<typeof insertNutritionGoalSchema>;

export type WeightEntry = z.infer<typeof selectWeightEntrySchema>;
export type NewWeightEntry = z.infer<typeof insertWeightEntrySchema>;

export type BodyMeasurement = z.infer<typeof selectBodyMeasurementSchema>;
export type NewBodyMeasurement = z.infer<typeof insertBodyMeasurementSchema>;

export type MealPlan = z.infer<typeof selectMealPlanSchema>;
export type NewMealPlan = z.infer<typeof insertMealPlanSchema>;

export type UserSettings = z.infer<typeof selectUserSettingsSchema>;
export type NewUserSettings = z.infer<typeof insertUserSettingsSchema>;

export const weightEntriesRelations = relations(weightEntries, ({ one }) => ({
  user: one(users, {
    fields: [weightEntries.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  weightEntries: many(weightEntries),
}));
