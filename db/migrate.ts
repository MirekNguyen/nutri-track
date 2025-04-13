import { migrate } from "drizzle-orm/neon-http/migrator"
import { db } from "./index"

// This script will run the migrations
async function runMigration() {
  console.log("Running migrations...")

  try {
    await migrate(db, { migrationsFolder: "drizzle" })
    console.log("Migrations completed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

runMigration()
