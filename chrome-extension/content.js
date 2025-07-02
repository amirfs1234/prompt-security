document.addEventListener("change", async (event) => {
    
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.type !== "file") return;
    
    const file = target.files?.[0];
    if (!file || !file.name.endsWith(".pdf")) return;
  
    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
  
      const response = await fetch("http://localhost:3000/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, prompt: base64 }),
      });
  
      const result = await response.json();
      const url = window.location.href;
      chrome.storage.local.get(['scanHistoryByUrl'], (data) => {
        const scanHistoryByUrl = data.scanHistoryByUrl || {};
        const scansForUrl = Array.isArray(scanHistoryByUrl[url]) ? scanHistoryByUrl[url] : [];
        const newScan = {
          secretsDetected: !result.safePrompt,
          fileName: file.name,
          timestamp: new Date().toISOString(),
          conversation_id: result.conversation_id
        };
        scansForUrl.push(newScan);
        scanHistoryByUrl[url] = scansForUrl;
        chrome.storage.local.set({ scanHistoryByUrl });
        if (!result.safePrompt) {
          alert("🚨 Secret detected in uploaded PDF!");
        }
      });
    } catch (err) {
      console.error("Error scanning PDF:", err);
    }
  });
  