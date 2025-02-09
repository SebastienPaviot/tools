document.getElementById("saveApiKeyBtn").addEventListener("click", saveApiKey);
document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

function saveApiKey() {
    const apiKey = document.getElementById("apiKeyInput").value.trim();
    if (!apiKey) {
        alert("Veuillez entrer une clé API valide.");
        return;
    }
    sessionStorage.setItem("openai_api_key", apiKey);

    // Cache immédiatement le formulaire et affiche le chatbot
    document.getElementById("apiKeyForm").style.display = "none";
    document.getElementById("chatContainer").classList.remove("hidden");

    // Force le chat à scroller vers le bas dès l'affichage
    scrollToBottom();
}

async function sendMessage() {
    const apiKey = sessionStorage.getItem("openai_api_key");
    if (!apiKey) {
        alert("Veuillez entrer votre clé API.");
        return;
    }

    const userInput = document.getElementById("userInput").value.trim();
    if (!userInput) return;

    addMessage("Vous", userInput, "bg-gray-300 text-black");

    document.getElementById("userInput").value = "";

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: userInput }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const botMessage = data.choices?.[0]?.message?.content || "Je n'ai pas compris.";
        addMessage("Bot", botMessage, "bg-blue-500 text-white");
    } catch (error) {
        console.error(error);
        addMessage("Bot", "Erreur lors de la communication avec l'API.", "bg-red-500 text-white");
    }
}

function addMessage(sender, text, classes) {
    const chatbox = document.getElementById("chatbox");
    const messageElement = document.createElement("div");
    messageElement.classList = `p-3 rounded-lg w-fit max-w-xs ${classes}`;
    messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
    
    chatbox.appendChild(messageElement);
    scrollToBottom();
}

function scrollToBottom() {
    const chatbox = document.getElementById("chatbox");
    setTimeout(() => {
        chatbox.scrollTop = chatbox.scrollHeight;
    }, 100);
}

// Vérifie si la clé API est déjà enregistrée
window.onload = function () {
    if (sessionStorage.getItem("openai_api_key")) {
        document.getElementById("apiKeyForm").style.display = "none";
        document.getElementById("chatContainer").classList.remove("hidden");

        // Forcer le chat à démarrer en bas
        scrollToBottom();
    }
};
