import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0";

// Fonction pour afficher la modale
function showLoading() {
    document.getElementById("loadingModal").style.display = "flex";
}

// Fonction pour masquer la modale
function hideLoading() {
    document.getElementById("loadingModal").style.display = "none";
}

// Crée une pipeline de génération de texte
async function createPipeline() {
    showLoading(); // Affiche la modale
    const generator = await pipeline(
        "text-generation",
        "onnx-community/Qwen2.5-0.5B-Instruct",
        { dtype: "q4", device: "webgpu" }
    );
    hideLoading(); // Masque la modale
    return generator;
}

// Définition de la liste des messages par défaut
const defaultMessages = [
    { role: "system", content: "You are a helpful assistant." }
];

// Fonction asynchrone transform
async function transform() {
    const userInput = document.getElementById("userInput");
    const inputValue = userInput.value;

    // Ajoute le message de l'utilisateur
    const messages = [...defaultMessages, { role: "user", content: inputValue }];

    try {
        // Génère la réponse
        const output = await generator(messages, { max_new_tokens: 128 });
        const generatedContent = output[0].generated_text.at(-1).content; // Accède directement au texte généré

        // Affiche le message généré dans la div "result"
        document.getElementById("result").textContent = generatedContent;

        // Vide le champ de saisie
        userInput.value = "";
    } catch (error) {
        console.error("Erreur lors de la génération de texte :", error);
        document.getElementById("result").textContent = "Erreur lors de la génération de texte.";
    }
}

// Initialisation de la pipeline et stockage dans une variable globale
let generator;
createPipeline().then(gen => generator = gen);

// Rend la fonction transform accessible globalement
window.transform = transform;
