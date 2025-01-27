import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export const createChatStream = async(messages: any[], productDetails: any) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const chat = model.startChat({
        history: messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        })),
        generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 2048,
        },
    });

    const result = await chat.sendMessage(productDetails);
    const response = await result.response;
    return response.text();
}
