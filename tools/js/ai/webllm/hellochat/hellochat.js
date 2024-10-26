import * as webllm from "https://esm.run/@mlc-ai/web-llm";

await calculateCacheStorageSize();
localStorage.clear();
sessionStorage.clear();
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      //caches.delete(cacheName);
    });
  });
}
await calculateCacheStorageSize();

console.log("cache deleted");

const downloadPopup = document.getElementById('download-popup');
//const closePopupBtn = document.getElementById('close-popup');

// Fonction pour ouvrir la popup
function showPopup(message) {
  document.getElementById("download-status").textContent = message;
  downloadPopup.classList.remove('hidden');
}

// Fonction pour fermer la popup
function closePopup() {
  downloadPopup.classList.add('hidden');
}

//closePopupBtn.addEventListener('click', closePopup);


var messages = [
  {
    content: "You are nice. Limit each response to 50 words or fewer.",
    role: "system",
  },
];

console.log("hellochat v0.8");
const availableModels = webllm.prebuiltAppConfig.model_list.map(
  (m) => m.model_id,
);
//console.log(availableModels);

let selectedModel = "TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC";

// Callback function for initializing progress
function updateEngineInitProgressCallback(report) {
  //console.log("initialize", report.progress);
  document.getElementById("download-status").textContent = report.text;
}

// Create engine instance
const engine = new webllm.MLCEngine();
engine.setInitProgressCallback(updateEngineInitProgressCallback);

async function initializeWebLLMEngine() {
  document.getElementById("download-status").classList.remove("hidden");
  //selectedModel = document.getElementById("model-selection").value;
  console.log(selectedModel);
  const config = {
    temperature: 0.6,
    top_p: 0.9,
    max_tokens: 75, // Limite de sortie correspondant à environ 50 mots
  };
  console.log(config);
  await engine.reload(selectedModel, config);
  await calculateCacheStorageSize();
  closePopup();


}

async function streamingGenerating(messages, onUpdate, onFinish, onError) {
  console.log("streamingGenerating:"+messages);
  try {
    let curMessage = "";
    let usage;
    const completion = await engine.chat.completions.create({
      stream: true,
      temperature: 0.6,
      top_p: 0.9,
      max_tokens: 2000,
      presence_penalty: 0.0, 
      frequency_penalty: 0.0,
      messages,
      stream_options: { include_usage: true },
    });
    for await (const chunk of completion) {
      const curDelta = chunk.choices[0]?.delta.content;
      if (curDelta) {
        curMessage += curDelta;
      }
      if (chunk.usage) {
        usage = chunk.usage;
      }
      onUpdate(curMessage);
    }
    const finalMessage = await engine.getMessage();
    onFinish(finalMessage, usage);
  } catch (err) {
    onError(err);
  }
}

/*************** UI logic ***************/
function onMessageSend() {
  const input = document.getElementById("user-input").value.trim();
  const message = {
    content: input,
    role: "user",
  };
  if (input.length === 0) {
    return;
  }
  document.getElementById("send").disabled = true;
  messages = [];
  messages.push(message);
  appendMessage(message);

  document.getElementById("user-input").value = "";
  document
    .getElementById("user-input")
    .setAttribute("placeholder", "Generating...");

  const aiMessage = {
    content: "typing...",
    role: "assistant",
  };
  appendMessage(aiMessage);

  const onFinishGenerating = (finalMessage, usage) => {
    console.log("onFinishGenerating:"+finalMessage);
    updateLastMessage(finalMessage);
    document.getElementById("send").disabled = false;
    const usageText =
      `prompt_tokens: ${usage.prompt_tokens}, ` +
      `completion_tokens: ${usage.completion_tokens}, ` +
      `prefill: ${usage.extra.prefill_tokens_per_s.toFixed(4)} tokens/sec, ` +
      `decoding: ${usage.extra.decode_tokens_per_s.toFixed(4)} tokens/sec`;
    //document.getElementById("chat-stats").classList.remove("hidden");
   // document.getElementById("chat-stats").textContent = usageText;
  };

  streamingGenerating(
    messages,
    updateLastMessage,
    onFinishGenerating,
    console.error,
  );
}

function appendMessage(message) {
  const chatBox = document.getElementById("chat-box");
  const container = document.createElement("div");
  container.classList.add("message-container");
  const newMessage = document.createElement("div");
  newMessage.classList.add("message");
  newMessage.innerHTML = message.content.replace(/\n/g, '<br>');

  if (message.role === "user") {
    container.classList.add("user");
  } else {
    container.classList.add("assistant");
  }

  container.appendChild(newMessage);
  chatBox.appendChild(container);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

function updateLastMessage(content) {
  const messageDoms = document
    .getElementById("chat-box")
    .querySelectorAll(".message");
  const lastMessageDom = messageDoms[messageDoms.length - 1];
  lastMessageDom.innerHTML = content;
}


/*************** UI binding ***************/
availableModels.forEach((modelId) => {
  /*
  const option = document.createElement("option");
  option.value = modelId;
  option.textContent = modelId;
  document.getElementById("model-selection").appendChild(option);
  */
});
//document.getElementById("model-selection").value = selectedModel;
/*
document.getElementById("download").addEventListener("click", function () {
  showPopup("initialisation");
  initializeWebLLMEngine().then(() => {
    document.getElementById("send").disabled = false;
  });
});
*/
document.getElementById("send").addEventListener("click", function () {
  onMessageSend();
});

function initchat() {
  console.log("initchat");
  showPopup("initialisation");
  initializeWebLLMEngine().then(() => {
    document.getElementById("send").disabled = false;
  });
}

setTimeout(initchat, 2000);

async function calculateCacheStorageSize() {
  let totalSize = 0;

  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);

      if (response) {
        const clonedResponse = response.clone();
        const body = await clonedResponse.arrayBuffer();
        totalSize += body.byteLength; // Taille en octets
      }
    }
  }

  console.log(`Cache Storage Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  return totalSize;
}



