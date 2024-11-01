import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0";


// Create a text generation pipeline
const generator = await pipeline(
  "text-generation",
  "onnx-community/Qwen2.5-0.5B-Instruct",
  { dtype: "q4", device: "webgpu" },
);

// Define the list of messages
const messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "Tell me a funny joke." },
];

// Generate a response
var output = await generator(messages, { max_new_tokens: 128 });
console.log(output[0].generated_text.at(-1).content);

export function transform() {
    // Récupère la valeur entrée par l'utilisateur
    const userInput = document.getElementById("userInput").value;
    
    var  output = await generator(messages, { max_new_tokens: 128 });
console.log(output[0].generated_text.at(-1).content);

    // Affiche le message dans la div avec l'ID "result"
    document.getElementById("result").textContent = output[0].generated_text.at(-1).content;
}
