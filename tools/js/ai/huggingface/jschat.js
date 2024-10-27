import { HfInference } from "https://esm.sh/@huggingface/inference"


import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.1';




const hf = new HfInference();



export function divlog(message) {
  // Sélection de la div où afficher le message
  const logDiv = document.getElementById("log");

  // Création d'un élément de message
  const messageElement = document.createElement("div");
  messageElement.textContent = message;

  // Ajout du message à la div "log"
  logDiv.appendChild(messageElement);
}

// Exemple d'appel de la fonction divlog
divlog("Bienvenue sur JS Chat !");
divlog("v0.395");
divlog("Ce message est généré par la fonction divlog.");

/*
await hf.textGeneration({
  model: 'gpt2',
  inputs: 'The answer to the universe is'
})

for await (const output of hf.textGenerationStream({
  model: "google/flan-t5-xxl",
  inputs: 'repeat "one two three four"',
  parameters: { max_new_tokens: 250 }
})) {
  console.log(output.token.text, output.generated_text);
  divlog(output.generated_text);
}
*/

// Allocate a pipeline for sentiment-analysis
var pipe = await pipeline('sentiment-analysis');

const out = await pipe('I love transformers!');
// [{'label': 'POSITIVE', 'score': 0.999817686}]
console.log(out);
divlog(out);


// using pipeline function
pipe = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat', {model_file_name: 'decoder_model_merged'})
// using AutoModel class
//let model = await AutoModel.from_pretrained('Xenova/Qwen1.5-0.5B-Chat', {model_file_name:'decoder_model_merged'})
// will fetch decoder_model_merged_quantized.onnx


// Create a text-generation pipeline
const generator = pipe;

// Generate text (default parameters)
const text = 'What is the capital of France?';
const output = await generator(text);
console.log(output);
// [{ generated_text: 'Once upon a time, I was in a room with a woman who was very attractive. She was' }]

// Generate text (custom parameters)
const output2 = await generator(text, {
    max_new_tokens: 20,
    do_sample: true,
    top_k: 5,
});
console.log(output2);