import { db } from "./index"
import { users, meals, nutritionGoals } from "./schema"

async function seed() {
  console.log("Seeding database...")

  try {
    // Insert a default user
    const [user] = await db
      .insert(users)
      .values({
        name: "John Doe",
        email: "john.doe@example.com",
      })
      .returning()

    console.log("Created user:", user)

    // Insert default nutrition goals
    await db.insert(nutritionGoals).values({
      userId: user.id,
      calorieGoal: 2000,
      proteinGoal: 150,
      carbsGoal: 200,
      fatGoal: 65,
    })

    // Insert sample meals
    await db.insert(meals).values([
      {
        userId: user.id,
        name: "Grilled Chicken Salad",
        unit: "serving",
        description: "Grilled chicken breast with mixed greens, cherry tomatoes, cucumber, and balsamic vinaigrette.",
        calories: 450,
        protein: 40,
        carbs: 15,
        fat: 22,
        tags: ["high-protein", "low-carb", "lunch"],
        isFavorite: true,
      },
      {
        userId: user.id,
        name: "Protein Smoothie Bowl",
        unit: "bowl",
        description: "Protein powder, frozen berries, banana, almond milk, topped with granola and chia seeds.",
        calories: 420,
        protein: 30,
        carbs: 45,
        fat: 10,
        tags: ["breakfast", "high-protein", "vegetarian"],
        isFavorite: true,
      },
      {
        userId: user.id,
        name: "Salmon with Roasted Vegetables",
        unit: "serving",
        description: "Baked salmon fillet with roasted broccoli, carrots, and sweet potatoes.",
        calories: 480,
        protein: 32,
        carbs: 30,
        fat: 22,
        tags: ["dinner", "high-protein", "omega-3"],
        isFavorite: false,
      },
      {
        userId: user.id,
        name: "Avocado Toast with Eggs",
        unit: "slice",
        description: "Whole grain toast topped with mashed avocado, poached eggs, and red pepper flakes.",
        calories: 380,
        protein: 18,
        carbs: 28,
        fat: 22,
        tags: ["breakfast", "vegetarian"],
        isFavorite: false,
      },
      {
        userId: user.id,
        name: "Turkey and Quinoa Bowl",
        unit: "bowl",
        description: "Lean ground turkey with quinoa, black beans, corn, and salsa.",
        calories: 410,
        protein: 28,
        carbs: 42,
        fat: 14,
        tags: ["lunch", "high-protein", "meal-prep"],
        isFavorite: true,
      },
      {
        userId: user.id,
        name: "Greek Yogurt Parfait",
        unit: "cup",
        description: "Greek yogurt layered with berries, honey, and granola.",
        calories: 320,
        protein: 22,
        carbs: 38,
        fat: 8,
        tags: ["breakfast", "snack", "vegetarian"],
        isFavorite: false,
      },
      {
        userId: user.id,
        name: "Oatmeal with Berries",
        unit: "bowl",
        description: "Steel-cut oats cooked with almond milk, topped with mixed berries and a drizzle of honey.",
        calories: 350,
        protein: 12,
        carbs: 60,
        fat: 8,
        tags: ["breakfast", "vegetarian", "high-fiber"],
        isFavorite: false,
      },
    ])

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Seeding failed:", error)
    process.exit(1)
  }
}

seed()
