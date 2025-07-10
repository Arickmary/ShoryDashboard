
import { GoogleGenAI } from "@google/genai";
import type { Partner } from '../types';

let ai: GoogleGenAI | null = null;
let geminiInitError: string | null = null;

const apiKey = window.APP_CONFIG?.API_KEY;

if (!apiKey || apiKey.startsWith("YOUR_")) {
    geminiInitError = "Gemini API Key (API_KEY) is not set. Please add it to the script in your index.html file.";
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


export const generatePartnerSummary = async (partner: Partner): Promise<string> => {
    if (geminiInitError || !ai) {
        return geminiInitError || "An error occurred while initializing the AI summary service.";
    }
    
    const prompt = `
        Based on the following partner data, generate a concise and professional status summary of 2-3 sentences suitable for an internal review meeting.
        Start the summary with the partner's name.
        Highlight their current status and how long they've been a partner. Do not use markdown.

        Partner Data:
        - Name: ${partner.name}
        - Status: ${partner.status}
        - Joined On: ${new Date(partner.join_date).toLocaleDateString()}
        - Contact Person: ${partner.contact_person.name}
        - Description & Notes: ${partner.description}

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
