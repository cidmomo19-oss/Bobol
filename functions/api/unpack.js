export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "URL mana bang?" }), { 
        status: 400, headers: { "Content-Type": "application/json" } 
    });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Accept": "text/html"
      }
    });

    if (!response.ok) throw new Error("Gagal ambil halaman Pastelink. Status: " + response.status);

    const html = await response.text();
    const regex = /var setup = "(.*?)";/;
    const match = html.match(regex);

    if (match && match[1]) {
      const setupStr = match[1].replace("#pas?te=link&", "");
      const params = new URLSearchParams(setupStr);

      const decodeB64 = (str) => {
        if (!str) return null;
        try { return decodeURIComponent(atob(str)); } catch (e) { return "Gagal Decode"; }
      };

      return new Response(JSON.stringify({
        success: true,
        link: decodeB64(params.get('c')),
        pw: params.get('pw') ? atob(params.get('pw')) : "Gak Ada",
        date: decodeB64(params.get('t'))
      }), { headers: { "Content-Type": "application/json" } });

    } else {
      return new Response(JSON.stringify({ error: "Data 'setup' ga ketemu. Linknya bener ga?" }), { 
        status: 404, headers: { "Content-Type": "application/json" } 
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
        status: 500, headers: { "Content-Type": "application/json" } 
    });
  }
}
