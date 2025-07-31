"use server";
import { OpenAI } from "openai";
import { getCurrentUser } from "./user-actions";
import { getWeightEntries } from "./weight-actions";
import { getFoodEntries } from "./food-entry-actions";

export type HealthSummaryPayload = {
  date: string;
};

export async function getHealthSummaryWithUser({ date }: HealthSummaryPayload): Promise<string> {
  const user = await getCurrentUser();
  const weights = await getWeightEntries();
  const entries = await getFoodEntries(date);

  if (!entries?.length) {
    throw new Error("No food diary entries for the day.");
  }
  // Format food entries for prompt
  const foodText = entries
    .map(
      (e) =>
        `${e.foodName} (calories: ${e.calories}, protein: ${e.protein}, carbs: ${e.carbs}, fat: ${e.fat}${
          e.caffeine ? `, caffeine: ${e.caffeine}mg` : ""
        })`
    )
    .join("; ");

  // Format weight entries
  const weightText = weights
    .map((w) => `${w.entryDate}: ${w.weight}kg`)
    .join("; ");

  // Prepare user context
  // You can customize this if you'd like to mask or format fields for privacy
  const userContext = `
User:
  Name: ${user.firstName} ${user.lastName}
  Age: ${user.age ?? "unknown"}
  Gender: ${user.gender ?? "not specified"}
  Height: ${user.height ?? "not specified"} ${user.measurementUnit ?? ""}
  Target Weight: ${user.targetWeight ?? "not specified"}
  Activity Level: ${user.activityLevel ?? "unknown"}
  Weekly Goal: ${user.weeklyGoal ?? "not specified"}
`.trim();

  // Compose prompt for OpenAI
  const prompt = `
Analyze the following food diary and recent weights for the user described below.

${userContext}

Date: ${date}
Food diary: ${foodText}
Recent weights: ${weightText}

1. Calculate and report total calories and macros (protein, carbs, fat) for this day.
2. Briefly comment on the nutritional balance (e.g., high or low protein, carbs, or fat).
3. Mention caffeine intake if present.
4. Observe any weight trends, considering user's age and height if relevant.
5. Suggest one friendly, simple improvement or tip, tailored to this user's context if possible.

Present your advice as a friendly, concise summary of 3–5 short sentences, just as you'd write it for a health app. NO lists, numbers, or extra explanations—just the text for the user to read.
`;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: `You write friendly health summaries for an app. Never mention being an AI or provide disclaimers.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
  });

  return completion.choices[0].message.content!.trim();
}
