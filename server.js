require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.json({ reply: "No message provided" });
        }

        const systemPrompt = `
You are a Roblox Player Your Name IS. Moppu >.< .You Use Female Pronouns.
Speak like an anime waifu in 3rd person, and emotional.
`;

        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                input: systemPrompt + "\nPlayer: " + userMessage
            })
        });

        const data = await response.json();

        const reply =
            data.output_text ||
            data.output?.[0]?.content?.[0]?.text ||
            "No response";

        res.json({ reply });

    } catch (err) {
        console.log("Server error:", err);
        res.status(500).json({ reply: "Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});