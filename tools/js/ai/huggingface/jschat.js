import { HfInference } from "https://esm.sh/@huggingface/inference"



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
divlog("v0.2");
divlog("Ce message est généré par la fonction divlog.");
