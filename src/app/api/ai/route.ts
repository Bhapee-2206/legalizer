import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import constitutionData from "@/data/indianConstitution.json";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  let prompt = "";
  try {
    const body = await req.json();
    prompt = body.prompt || "";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Prepare context from local constitution data
    const query = prompt.toLowerCase();
    const matchedArticles = constitutionData.filter(doc => 
      doc.article.toLowerCase().includes(query) ||
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.tags.some(tag => tag.toLowerCase().includes(query))
    ).slice(0, 3);

    let contextString = "";
    if (matchedArticles.length > 0) {
      contextString = "Use the following Indian Constitution articles as reference if applicable:\n" + 
        matchedArticles.map(a => `${a.article}: ${a.title} - ${a.description}`).join("\n\n");
    }

    const fullPrompt = `You are Legalizer AI, an expert in Indian Law and the Constitution. 
    ${contextString}
    
    User Query: ${prompt}
    
    Provide a professional, accurate, and helpful legal response. If you reference specific articles, mention them clearly.`;

    let text = "";
    let usedModel = "gemini-2.0-flash";

    try {
      // Primary: gemini-2.0-flash (Ultra-fast, newest generation)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      text = response.text();
    } catch (e1) {
      console.warn("Gemini 2.0 Flash failed, trying Gemini Pro Latest...");
      try {
        // Fallback 1: gemini-pro-latest
        const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        text = response.text();
        usedModel = "gemini-pro-latest";
      } catch (e2) {
        console.error("All Gemini models failed:", e2);
        throw e2;
      }
    }

    if (!text) throw new Error("Empty response from AI");

    return NextResponse.json({ 
      content: text,
      articles: matchedArticles,
      model: usedModel
    });
  } catch (error: any) {
    console.error("CRITICAL Gemini API Error:", error.message || error.toString());
    if (error.status) console.error("Error Status:", error.status);
    if (error.response) console.error("Error Response Data:", await error.response.json().catch(() => "N/A"));
    
    console.error("Diagnostic Info:", {
      apiKeyPresent: !!process.env.GEMINI_API_KEY,
      apiKeyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 7) : "MISSING"
    });
    
    // Always fallback to local simulation if any API error occurs
    try {
      const query = prompt.toLowerCase();
      
      const matchedArticlesFallback = constitutionData.filter(doc => 
        doc.article.toLowerCase().includes(query) ||
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      ).slice(0, 3);

      let fallbackContent = "";
      if (matchedArticlesFallback.length > 0) {
        const primary = matchedArticlesFallback[0];
        fallbackContent = `[OFFLINE MODE] Based on Article ${primary.article.replace('Article ', '')}: ${primary.title}, it states: ${primary.description}\n\nThis is a simulated response because the live AI service is currently unavailable.`;
      } else {
        fallbackContent = "[OFFLINE MODE] I am currently operating in limited capacity due to a connection issue with the main AI engine. I can still help with basic Constitution queries based on my local database. How can I help?";
      }

      return NextResponse.json({ 
        content: fallbackContent,
        articles: matchedArticlesFallback,
        isSimulated: true
      });
    } catch (fallbackError) {
      return NextResponse.json({ error: "Critial AI Failure" }, { status: 500 });
    }
  }
}
