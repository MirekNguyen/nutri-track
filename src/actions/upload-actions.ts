"use server";
import { OpenAI } from "openai";

export type Macros = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  amount: number;
  unit: "serving" | "g" | "ml" | "oz" | "cup" | "tbsp" | "tsp" | "piece";
};

// Multi-image upload (up to 3), single OpenAI Vision API call, label-aware prompt!
export async function uploadAndAnalyze(files: File[]): Promise<Macros> {
  // Grab all images from FormData ("images" as the field name!)
  // const files = formData.getAll("images").filter(
  //   (f): f is File => f instanceof File && f.size > 0
  // );
  if (files.length < 1 || files.length > 3) {
    throw new Error("You must upload between 1 and 3 images.");
  }

  // Prepare images for OpenAI API (base64)
  const imagesContent = await Promise.all(
    files.map(async (file) => ({
      type: "image_url" as const,
      image_url: {
        url: `data:${file.type || "image/jpeg"};base64,${Buffer.from(
          await file.arrayBuffer(),
        ).toString("base64")}`,
      },
    })),
  );

  const prompt = `
Analyze ALL images of the SAME meal jointly for better accuracy. 
Use visual recognition, portion estimation (consider known object sizes for scale), AND if visible, any nutrition facts, ingredients lists, manufacturer stickers, or packaging for nutritional values. Prefer label/panel info if visible, otherwise estimate using up-to-date, regionally appropriate nutrition databases. Harmonize your answer if there are discrepancies.
Output a single JSON object:
{
  name: string,
  calories: number,
  protein: number,
  carbs: number,
  fats: number,
  amount: number,
  unit: "serving" | "g" | "ml" | "oz" | "cup" | "tbsp" | "tsp" | "piece"
}
No explanation. Never output anything but JSON. Don't guess if not plausible.
`;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1",
    max_tokens: 350,
    messages: [
      {
        role: "system",
        content: `You are a nutritionist and image analyst. Respond ONLY with JSON of this type:
type Macros = {
  name: string; // max 40 characters
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  amount: number;
  unit: "serving" | "g" | "ml" | "oz" | "cup" | "tbsp" | "tsp" | "piece";
};
name = the primary food name (40 characters max). All values must be realistic, plausible and consistent with the food visible.`,
      },
      {
        role: "user",
        content: [{ type: "text", text: prompt }, ...imagesContent],
      },
    ],
  });

  const outputText = completion.choices[0].message.content!;
  const jsonStart = outputText.indexOf("{");
  const jsonEnd = outputText.lastIndexOf("}");
  const jsonText = outputText.slice(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(jsonText);
  } catch (err) {
    console.error("JSON parsing error:", jsonText, err);
    throw new Error("Could not parse AI result. Try again.");
  }
}
