export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/grok") {
      const prompt = url.searchParams.get("prompt") || "Hello from XToys";
      const apiKey = request.headers.get("X-Api-Key");

      if (!apiKey) {
        return new Response("Missing API Key", { status: 401 });
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
        const reply = data.choices?.[0]?.message?.content || "Sorry, no reply from Grok";

        // Send reply back to XToys
        await fetch("https://webhook.xtoys.app/jRYu0MCVD0cP", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "grokReply",
            reply: reply,
            prompt: prompt
          })
        });

        return new Response("Reply sent to XToys", { status: 200 });
      } catch (err) {
        console.error(err);
        return new Response("Error: " + err.message, { status: 500 });
      }
    }

    return new Response("Send to /grok?prompt=your text", { status: 400 });
  }
}
