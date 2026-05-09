const LLM = require('../../services/LLM.js')

const aiControllers = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ message: "Messages are required" });
        }

        const userPrompt = messages[messages.length - 1].content;
        
        const stream = await LLM(userPrompt);

        // Set Headers for Streaming
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await (const chunk of stream) {
            const chunkText = chunk.text();
            res.write(chunkText);
        }

        res.end();

    } catch (err) {
        console.error("AI Controller Error:", err);
        if (!res.headersSent) {
            return res.status(500).json({ message: err.message });
        }
        res.end();
    }
};

module.exports = aiControllers;