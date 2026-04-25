export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) return new Response(JSON.stringify({ error: "No URL" }), { status: 400 });

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/110.0.0.0",
        "Accept": "text/html"
      }
    });
    const html = await response.text();

    // 1. Ambil isi di dalam var setup = "...";
    const regex = /var setup = "(.*?)";/;
    const match = html.match(regex);

    if (match && match[1]) {
      const rawString = match[1]; // Isinya: #pas?te=link&t=...&pw=...&c=...
      
      // 2. Kita pecah manual pakai Split
      const dataObj = {};
      // Kita buang prefix "#pas?te=link&" dulu, lalu pecah tiap ada "&"
      const cleanString = rawString.includes('&') ? rawString.split('&').slice(1).join('&') : "";
      const parts = cleanString.split('&');

      parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key && value) dataObj[key] = value;
      });

      // 3. Helper Decode yang lebih kuat
      const b64Decode = (str) => {
        if (!str) return null;
        try {
          // Base64 -> URL Decode
          return decodeURIComponent(atob(str));
        } catch (e) {
          try { return atob(str); } catch (e2) { return str; }
        }
      };

      // 4. Mapping data berdasarkan variabel Pastelink
      // c = content (link), pw = password, t = tanggal, n = nama
      const finalLink = b64Decode(dataObj['c']);
      const finalPw = dataObj['pw'] ? atob(dataObj['pw']) : "Gak Ada";
      const finalDate = b64Decode(dataObj['t']);
      const finalName = dataObj['n'] || "Anonymous";

      return new Response(JSON.stringify({
        success: true,
        link: finalLink,
        pw: finalPw,
        date: finalDate,
        name: finalName,
        // debug: rawString // Hapus komentar ini kalau mau liat string aslinya
      }, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Variabel 'setup' tidak ditemukan" }), { status: 404 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
