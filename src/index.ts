export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only allow calls to /grok
    if (url.pathname === "/grok") {
      const prompt = url.searchParams.get("prompt") || "Hello from XToys";
      const apiKey = request.headers.get("X-Api-Key");

      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Missing API Key" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }

      try {
        const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
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

        const data = await grokRes.json();

        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // Default help message
    return new Response("Use: /grok?prompt=Your message here", { status: 400 });
  }
}
