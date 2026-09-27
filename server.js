import express from "express";
import { QWEN3_600M_INST_Q4, loadModel, completion, unloadModel } from "@qvac/sdk";
import { jsonrepair } from "jsonrepair";

const app = express();
const PORT = 3000;
let modelId = null;

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

async function getModel() {
  if (modelId) return modelId;

  modelId = await loadModel({
    modelSrc: QWEN3_600M_INST_Q4,
    modelType: "llamacpp-completion",
    modelConfig: { ctx_size: 4096 }
  });

  return modelId;
}

function parseJSON(text) {
  let cleaned = String(text || "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end <= start) {
    throw new Error("Model did not return valid JSON.");
  }

  return JSON.parse(jsonrepair(cleaned.slice(start, end + 1)));
}

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    qvac: true,
    local: true,
    modelLoaded: Boolean(modelId),
    app: "ExplainForge",
    version: "1.0.0"
  });
});

app.post("/api/explain", async (req, res) => {
  try {
    const text = String(req.body.text || "").trim();
    const level = String(req.body.level || "Student");

    if (!text) {
      return res.status(400).json({ error: "Please enter some text." });
    }

    const id = await getModel();

    const prompt = `/no_think
Explain the following text for a ${level} audience.

TEXT:
${text}

Return ONLY JSON:

{
  "explanation": "Clear explanation",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "example": "A simple example",
  "takeaway": "One sentence takeaway"
}

Be accurate, concise and easy to understand.
Do not include commentary outside the JSON.`;

    const run = completion({
      modelId: id,
      history: [{ role: "user", content: prompt }],
      stream: true
    });

    const final = await run.final;
    const output = final?.contentText || final?.raw?.fullText || "";

    res.json(parseJSON(output));
  } catch (error) {
    console.error("ExplainForge error:", error);
    res.status(500).json({
      error: "Failed to explain the text.",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`ExplainForge running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  try {
    if (modelId) await unloadModel({ modelId, clearStorage: false });
  } catch {}
  process.exit(0);
});
