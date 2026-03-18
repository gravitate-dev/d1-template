export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Only allow requests from XToys (optional security)
    const origin = request.headers.get("Origin");
    if (origin && !origin.includes("xtoys.app")) {
      return new Response("Forbidden", { status: 403 });
    }

    if (url.pathname === "/grok") {
      const prompt = url.searchParams.get("prompt") || "Hello";
      const apiKey = request.headers.get("X-Api-Key");

      if (!apiKey) {
        return new Response("Missing API Key", { status: 401 });
      }

      const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "grok-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });

      const data = await grokResponse.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Use /grok?prompt=your text", { status: 400 });
  }
}
