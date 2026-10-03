const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY is not set");
  process.exit(1);
}

async function main() {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.error("❌ API Error:", response.status);
    console.error(await response.text());
    return;
  }

  const data = await response.json();

  console.log("\n========== AVAILABLE GEMINI MODELS ==========\n");

  for (const model of data.models || []) {
    console.log(`Model: ${model.name}`);
    console.log(`Display: ${model.displayName || "N/A"}`);
    console.log(`Description: ${model.description || "N/A"}`);
    console.log(
      `Input tokens: ${model.inputTokenLimit || "N/A"}`
    );
    console.log(
      `Output tokens: ${model.outputTokenLimit || "N/A"}`
    );
    console.log(
      `Supported actions: ${(model.supportedGenerationMethods || model.supportedActions || []).join(", ")}`
    );
    console.log("---------------------------------------------");
  }

  console.log(`\nTotal models returned: ${data.models?.length || 0}`);
}

main().catch(console.error);