"use server"

import { db } from "@/db"
import { userProfiles, type NewUserProfile } from "@/db/schema-extensions"
import { eq } from "drizzle-orm"
import { getCurrentUser } from "./user-actions"

export async function getUserProfile() {
  try {
    const user = await getCurrentUser()

    const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, user.id)).limit(1)

    const profile = result[0]

    if (!profile) {
      // Return null if no profile exists
      throw new Error("User profile not found")
    }

    return profile
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw new Error("Failed to get user profile")
  }
}

export async function createOrUpdateUserProfile(
  profileData: Omit<NewUserProfile, "id" | "userId" | "createdAt" | "updatedAt">,
) {
  try {
    const user = await getCurrentUser()

    // Check if profile already exists
    const existingProfile = await getUserProfile()

    if (existingProfile) {
      // Update existing profile
      const [updatedProfile] = await db
        .update(userProfiles)
        .set({
          ...profileData,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, user.id))
        .returning()

      return updatedProfile
    } else {
      // Create new profile
      const [newProfile] = await db
        .insert(userProfiles)
        .values({
          ...profileData,
          userId: user.id,
        })
        .returning()

      return newProfile
    }
  } catch (error) {
    console.error("Error creating/updating user profile:", error)
    throw new Error("Failed to create/update user profile")
  }
}
