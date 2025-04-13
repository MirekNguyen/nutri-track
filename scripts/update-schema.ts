import { migrate } from "drizzle-orm/neon-http/migrator"
import { db } from "../db"

// This script will run the migrations to update the database schema
async function updateSchema() {
  console.log("Updating database schema...")

  try {
    await migrate(db, { migrationsFolder: "drizzle" })
    console.log("Schema update completed successfully")
  } catch (error) {
    console.error("Schema update failed:", error)
    process.exit(1)
  }
}

updateSchema()
