import * as webllm from "https://esm.run/@mlc-ai/web-llm";

console.log("hellochat v0.1");
const availableModels = webllm.prebuiltAppConfig.model_list.map(
  (m) => m.model_id,
);
console.log(availableModels);

let selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-1k";
