import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // This line is necessary
});

export async function validateCrime(crimeDescription) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a crime validation assistant. Your task is to determine if the given description constitutes a valid crime. Respond with only 'Yes' if it's a valid crime, or 'No' if it's not a crime or too minor to report.",
        },
        {
          role: "user",
          content: `Is this a valid crime to report: ${crimeDescription}`,
        },
      ],
      temperature: 0.1,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error validating crime:", error);
    return "Error";
  }
}
