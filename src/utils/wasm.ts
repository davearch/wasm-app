export async function loadWasm() {
  return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/wasm/demo.js"; // Load from public folder
      script.onload = async () => {
          // Ensure the module is available globally
          if (typeof window.DemoWasmModule !== "undefined") {
              const instance = await window.DemoWasmModule(); // Initialize WASM
              resolve(instance);
          } else {
              reject(new Error("WASM module failed to load"));
          }
      };
      script.onerror = () => reject(new Error("Failed to load WASM script"));
      document.body.appendChild(script);
  });
}