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
divlog("v0.38");
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
const pipe = await pipeline('sentiment-analysis');

const out = await pipe('I love transformers!');
// [{'label': 'POSITIVE', 'score': 0.999817686}]
console.log(out);
divlog(out);

// Create a text-generation pipeline
const generator = await pipeline('text-generation');

// Generate text (default parameters)
const text = 'Once upon a time,';
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