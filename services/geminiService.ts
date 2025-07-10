import { GoogleGenAI } from "@google/genai";
import type { InsuranceProduct } from '../types';

let ai: GoogleGenAI | null = null;
let geminiInitError: string | null = null;

const apiKey = window.APP_CONFIG?.API_KEY;

if (!apiKey) {
    geminiInitError = "Gemini API Key (API_KEY) is not set in config.js.";
    console.error(geminiInitError);
} else {
    try {
        ai = new GoogleGenAI({ apiKey });
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        geminiInitError = `Failed to initialize Gemini client: ${message}`;
        console.error(geminiInitError);
    }
}


export const generateInsuranceProductSummary = async (product: InsuranceProduct): Promise<string> => {
    if (geminiInitError || !ai) {
        return geminiInitError || "An error occurred while initializing the AI summary service.";
    }
    
    const prompt = `
        Based on the following insurance product data, generate a concise and professional status summary of 2-3 sentences suitable for an internal portfolio review meeting.
        Start the summary with the product's name.
        Highlight its current status, target market (based on category), and any key features or recent developments. Do not use markdown.

        Insurance Product Data:
        - Name: ${product.name}
        - Status: ${product.status}
        - Category / Line of Business: ${product.category}
        - Policy Code: ${product.policyCode}
        - Underwriter: ${product.underwriter.name}
        - Last Update: ${new Date(product.lastUpdate).toLocaleDateString()}
        - Description & Notes: ${product.description}
        - Key Features: ${product.keyFeatures.join(', ')}

        Generate the summary now.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating summary with Gemini API:", error);
        return "An error occurred while generating the summary. Please check the console for details.";
    }
};