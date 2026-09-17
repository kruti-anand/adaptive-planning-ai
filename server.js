import express from "express";
import { generatePlanningResponse } from "./planner.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(process.cwd()));

app.post("/api/plan", (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "A planning conversation is required."
      });
    }

    const result = generatePlanningResponse(messages);

    if (!result || !result.type || !result.message) {
      return res.status(500).json({
        error: "The planning engine returned an invalid response."
      });
    }

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
  console.log(`Adaptive Planning running on port ${port}`);
});
