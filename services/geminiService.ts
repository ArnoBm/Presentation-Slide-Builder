
import { GoogleGenAI, Type } from "@google/genai";
import { Presentation } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please set your API key for the app to function.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const presentationSchema = {
    type: Type.OBJECT,
    properties: {
        slides: {
            type: Type.ARRAY,
            description: "An array of presentation slides.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "The main title of the slide. Should be concise and impactful."
                    },
                    content: {
                        type: Type.ARRAY,
                        description: "A list of bullet points for the slide content. Each string is one bullet point.",
                        items: {
                            type: Type.STRING
                        }
                    },
                    layout: {
                        type: Type.STRING,
                        'enum': ['TITLE', 'CONTENT', 'SECTION_HEADER', 'THANK_YOU'],
                        description: "Layout for the slide. Use 'TITLE' for the first slide, 'THANK_YOU' for the last, and 'CONTENT' or 'SECTION_HEADER' for others."
                    }
                },
                required: ["title", "content", "layout"]
            }
        }
    },
    required: ["slides"]
};

export const generatePresentation = async (topic: string): Promise<Presentation> => {
    try {
        const prompt = `Generate a professional and engaging presentation about "${topic}". 
        The presentation should have approximately 5-7 slides.
        - The first slide must be a title slide with a captivating title and a short subtitle in the content array.
        - The last slide must be a simple 'Thank You' or 'Q&A' slide.
        - Intermediate slides should cover key aspects of the topic, using 'CONTENT' layout for detailed points and 'SECTION_HEADER' for transitions if needed.
        - Ensure the content is structured into clear, concise bullet points.
        - Do not add any conversational text or markdown formatting like \`\`\`json. Only provide the JSON object.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: presentationSchema,
            },
        });

        const jsonText = response.text.trim();
        const presentationData = JSON.parse(jsonText);

        if (!presentationData || !Array.isArray(presentationData.slides)) {
            throw new Error("Invalid response structure from AI model.");
        }
        
        return presentationData as Presentation;

    } catch (error) {
        console.error("Error generating presentation:", error);
        throw new Error("Failed to generate presentation. The model may be unavailable or the topic could be too complex. Please try again.");
    }
};
