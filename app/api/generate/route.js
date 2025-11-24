


import { NextResponse } from 'next/server';
import OpenAI from "openai";

// Initialize OpenAI with environment variable
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:process.env.OPENAI_API_KEY // Store this in your .env.local file
});

export async function POST(request) {
  try {
    const { prompt, language } = await request.json();

    if (!prompt || !language) {
      return NextResponse.json(
        { error: 'Missing prompt or language' },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "user",
          content: `Generate ONLY valid ${language} code for the following request. 
          - Do not include explanations. 
          - Do not include conversational text.
          - Do not use markdown backticks at the start or end.
          
          Request: ${prompt}`
        }
      ]
    });

    let code = response.choices[0].message.content || "";

    // Clean up any Markdown formatting the AI might still send
    // 1. Remove ```language
    code = code.replace(/^```[a-zA-Z]*\n?/, "");
    // 2. Remove closing ```
    code = code.replace(/```$/, "");
    
    return NextResponse.json({ code: code.trim() });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
  }
}