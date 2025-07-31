// app/actions/uploadAndAnalyze.ts
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

export async function uploadAndAnalyze(formData: FormData): Promise<Macros> {
  // 1. Get the file from FormData and validate it with Zod
  const imageFile = formData.get("image");
  // const parseResult = imageUploadSchema.safeParse({ image: imageFile });
  //
  // if (!parseResult.success) {
  //   return { error: parseResult.error.errors[0]?.message ?? "Invalid image" };
  // }
  const file = imageFile as File;

  // 2. Read the file as buffer (required for OpenAI vision API)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimetype = file.type || "image/jpeg";
  const base64 = buffer.toString("base64");

  // 3. OpenAI call (Vision)
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const prompt = `
Analyze the provided high-resolution food image using expert food recognition and precise portion estimation. Incorporate scale reference objects (if present), metadata (e.g., meal type, cuisine), and visible preparation methods. Identify all meal components, estimate their portions and total amount as accurately as possible, and reference up-to-date, regionally appropriate nutritional databases. Output only a single JSON object with these keys: { name: string, calories: number, protein: number, carbs: number, fats: number, amount: number, unit: \"serving\" | \"g\" | \"ml\" | \"oz\" | \"cup\" | \"tbsp\" | \"tsp\" | \"piece\" }. All values must be precise, realistic, and reflect the standard serving size used. Output only the JSON, with no extra explanation.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1",
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content:
          `You are a nutritionist and image analyst who responds ONLY with the requested JSON. No explanation. The output must be in format of 
type Macros = {
name: string;
calories: number;
protein: number;
carbs: number;
fats: number;
amount: number;
unit: "serving" | "g" | "ml" | "oz" | "cup" | "tbsp" | "tsp" | "piece";
};

        `,
      },
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: `data:${mimetype};base64,${base64}` },
          },
        ],
      },
    ],
  });
  console.log("OpenAI response:", completion);

  const outputText = completion.choices[0].message.content!;
  console.log("Output text:", completion.choices[0].message);
  const jsonStart = outputText.indexOf("{");
  const jsonEnd = outputText.lastIndexOf("}");
  const jsonText = outputText.slice(jsonStart, jsonEnd + 1);
  console.log("JSON text:", jsonText);
  // Dummy-guard, in case parsing fails
  const parsed = JSON.parse(jsonText);
  return parsed;
}
