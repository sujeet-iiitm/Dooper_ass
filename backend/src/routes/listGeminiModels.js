import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function listGeminiModels() {
  try {
    const response = await axios.get(
      "https://generativelanguage.googleapis.com/v1beta/models",
      {
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    console.log("✅ Available Gemini Models:\n");
    response.data.models.forEach((model, index) => {
      console.log(`${index + 1}. ${model.name}`);
      console.log(`   Display Name: ${model.displayName}`);
      console.log(`   Description: ${model.description}`);
      console.log(`   Supported Methods: ${model.supportedGenerationMethods}`);
      console.log("---------------------------------------------------");
    });
  } catch (error) {
    console.error(
      "❌ Error listing models:",
      error.response?.data || error.message
    );
  }
}

listGeminiModels();
