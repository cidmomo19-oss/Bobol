export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "URL param is missing" }), { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/110.0.0.0 Safari/537.36" }
    });
    const html = await response.text();

    // Cari variabel setup di dalam script
    const regex = /var setup = "(.*?)";/;
    const match = html.match(regex);

    if (match && match[1]) {
      const setupStr = match[1].replace("#pas?te=link&", "");
      const params = new URLSearchParams(setupStr);

      const decodeB64 = (str) => {
        if (!str) return null;
        try { return decodeURIComponent(atob(str)); } catch (e) { return "Error"; }
      };

      const result = {
        success: true,
        content_link: decodeB64(params.get('c')),
        password: params.get('pw') ? atob(params.get('pw')) : "No Password",
        date: decodeB64(params.get('t')),
      };

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ error: "Data not found" }), { status: 404 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
