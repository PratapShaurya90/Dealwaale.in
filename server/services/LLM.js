const { GoogleGenerativeAI } = require("@google/generative-ai");
const systemInstruction = require("./SystemPrompts/systemprompt.js");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const LLM = async (inputMessage, customSystemInstruction) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: customSystemInstruction || systemInstruction
        });

        const result = await model.generateContentStream(inputMessage);

        return result.stream;

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};

module.exports = LLM;