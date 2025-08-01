"use server";

import { db } from "@/db";
import { userSettings, type NewUserSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "./user-actions";

export async function getUserSettings() {
  try {
    const user = await getCurrentUser();

    const result = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, user.id))
      .limit(1);

    const settings = result[0];

    if (!settings) {
      // Create default settings if none exist
      return createUserSettings({
        dailyReminders: true,
        goalUpdates: true,
        weeklySummary: true,
        appUpdates: false,
        newsletter: false,
        breakfastReminderTime: "08:00",
        lunchReminderTime: "12:30",
        dinnerReminderTime: "18:30",
        dataStorage: true,
        cloudBackup: true,
        analytics: true,
        personalization: true,
      });
    }

    return settings;
  } catch (error) {
    console.error("Error getting user settings:", error);
    throw new Error("Failed to get user settings");
  }
}

export async function createUserSettings(
  settingsData: Omit<
    NewUserSettings,
    "id" | "userId" | "createdAt" | "updatedAt"
  >,
) {
  try {
    const user = await getCurrentUser();

    // Check if settings already exist
    const existingSettings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, user.id))
      .limit(1);

    if (existingSettings[0]) {
      // Update existing settings
      return updateUserSettings(settingsData);
    }

    // Create new settings
    const [settings] = await db
      .insert(userSettings)
      .values({
        ...settingsData,
        userId: user.id,
      })
      .returning();

    return settings;
  } catch (error) {
    console.error("Error creating user settings:", error);
    throw new Error("Failed to create user settings");
  }
}

export async function updateUserSettings(
  settingsData: Partial<
    Omit<NewUserSettings, "id" | "userId" | "createdAt" | "updatedAt">
  >,
) {
  try {
    const user = await getCurrentUser();

    const [updatedSettings] = await db
      .update(userSettings)
      .set({
        ...settingsData,
        updatedAt: new Date(),
      })
      .where(eq(userSettings.userId, user.id))
      .returning();

    if (!updatedSettings) {
      throw new Error("User settings not found");
    }

    return updatedSettings;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw new Error("Failed to update user settings");
  }
}
