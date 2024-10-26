import * as webllm from "https://esm.run/@mlc-ai/web-llm";

console.log("hellochat v0.1");
const availableModels = webllm.prebuiltAppConfig.model_list.map(
  (m) => m.model_id,
);
console.log(availableModels);

let selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-1k";


/*************** UI binding ***************/
availableModels.forEach((modelId) => {
  const option = document.createElement("option");
  option.value = modelId;
  option.textContent = modelId;
  document.getElementById("model-selection").appendChild(option);
});
document.getElementById("model-selection").value = selectedModel;
document.getElementById("download").addEventListener("click", function () {
  initializeWebLLMEngine().then(() => {
    document.getElementById("send").disabled = false;
  });
});
document.getElementById("send").addEventListener("click", function () {
  onMessageSend();
});