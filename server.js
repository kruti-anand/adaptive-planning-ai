import express from "express";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

const planningPromptPath = path.join(
__dirname,
"prompts",
"planning.prompt.md"
);

const planningPrompt = fs.readFileSync(planningPromptPath, "utf8");

const responseSchema = {
type: "object",
additionalProperties: false,
properties: {
type: {
type: "string",
enum: ["question", "complete", "plan"]
},
message: {
type: "string"
},
why_it_matters: {
type: "string"
}
},
required: ["type", "message", "why_it_matters"]
};

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/plan", async (req, res) => {
try {
const { messages } = req.body;

if (!Array.isArray(messages) || messages.length === 0) {
  return res.status(400).json({
    error: "A planning conversation is required."
  });
}

const response = await client.responses.create({
  model: "gpt-5.6-luna",
  instructions: planningPrompt,
  input: messages.map((message) => ({
    role: message.role === "ai" ? "assistant" : "user",
    content: message.text
  })),
  text: {
    format: {
      type: "json_schema",
      name: "adaptive_planning_response",
      strict: true,
      schema: responseSchema
    }
  }
});

const result = JSON.parse(response.output_text);

res.json({
  response: result
});

} catch (error) {
console.error("Planning request failed:", error);

res.status(500).json({
  error: "Unable to process the planning request."
});

}
});

app.listen(port, () => {
console.log(`AI Adaptive Planning running on port ${port}`);
});
