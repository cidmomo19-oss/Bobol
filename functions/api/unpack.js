export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "URL mana?" }), { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/110.0.0.0" }
    });
    const html = await response.text();

    // Regex untuk ambil isi var setup
    const regex = /var setup = "(.*?)";/;
    const match = html.match(regex);

    if (match && match[1]) {
      let setupStr = match[1];
      
      // PERBAIKAN DI SINI: Bersihkan semua prefix sampai ketemu ampersand pertama
      // Karena formatnya: #pas?te=link&t=...
      if (setupStr.includes('&')) {
          setupStr = setupStr.substring(setupStr.indexOf('&') + 1);
      }

      const params = new URLSearchParams(setupStr);

      const decodeB64 = (str) => {
        if (!str) return null;
        try {
          // Base64 decode -> URL Decode
          return decodeURIComponent(atob(str));
        } catch (e) {
          try { return atob(str); } catch (e2) { return str; }
        }
      };

      // Ambil data berdasarkan parameter Pastelink
      const result = {
        success: true,
        link: decodeB64(params.get('c')), // 'c' adalah content/link mentah
        pw: params.get('pw') ? atob(params.get('pw')) : "Gak Ada",
        date: decodeB64(params.get('t')), // 't' adalah tanggal
        name: params.get('n') || "Anonymous" // 'n' adalah nama pembuat
      };

      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ error: "Gagal bongkar. Script setup gak ketemu." }), { status: 404 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
