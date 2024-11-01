import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0";

// Crée une pipeline de génération de texte
const generator = await pipeline(
  "text-generation",
  "onnx-community/Qwen2.5-0.5B-Instruct",
  { dtype: "q4", device: "webgpu" }
);

// Définition de la liste des messages par défaut
const defaultMessages = [
  { role: "system", content: "You are a helpful assistant." }
];

// Fonction transform asynchrone
export async function transform() {
    // Récupère la valeur entrée par l'utilisateur
    const userInput = document.getElementById("userInput").value;
    
    // Ajoute le message de l'utilisateur aux messages pour la génération
    const messages = [...defaultMessages, { role: "user", content: userInput }];

    // Génère une réponse
    try {
        const output = await generator(messages, { max_new_tokens: 128 });
        const generatedContent = output[0].generated_text.at(-1).content;

        // Affiche le message généré dans la div "result"
        document.getElementById("result").textContent = generatedContent;
    } catch (error) {
        console.error("Erreur lors de la génération de texte :", error);
        document.getElementById("result").textContent = "Erreur lors de la génération de texte.";
    }
}
