export default async function handler(req, res) {
  // Setel Header agar APK atau Domain lain bisa akses (Anti CORS Error)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, imageUrl, apiKey, provider, modelType } = req.body;

    if (!apiKey) return res.status(400).json({ error: 'Kunci API wajib diisi, cok!' });
    if (!imageUrl) return res.status(400).json({ error: 'Gambar penuntun wajib diunggah!' });

    // ================= JALUR 1: FAL.AI (KLING) =================
    if (provider === 'fal') {
      const endpoint = modelType === 'kling_pro' 
        ? 'https://queue.fal.run/fal-ai/kling-video/v1.5/pro/image-to-video'
        : 'https://queue.fal.run/fal-ai/kling-video/v1.5/standard/image-to-video';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          image_url: imageUrl,
          duration: 5,
          aspect_ratio: '16:9'
        })
      });

      const data = await response.json();
      if (!response.ok) return res.status(response.status).json({ error: data.detail || 'Akun Fal.ai lu bermasalah atau habis saldo.' });
      return res.status(200).json(data);
    } 
    
    // ================= JALUR 2: FREEPIK / MAGNIFIC =================
    else if (provider === 'freepik') {
      // Bersihin format Base64 biar murni kodenya aja yang dikirim ke Freepik
      const cleanBase64 = imageUrl.includes(',') ? imageUrl.split(',')[1] : imageUrl;
      const selectedModel = modelType || 'kling_3_0'; 

      const response = await fetch('https://api.freepik.com/v1/ai/image-to-video', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-freepik-api-key': apiKey.toLowerCase() // Penjinak otomatis kalau Chrome Translate kumat
        },
        body: JSON.stringify({
          prompt: prompt,
          image: cleanBase64,
          model: selectedModel,
          duration: 5,
          audio: false // KUNCI UTAMA: Memaksa video bisu/tanpa suara biar hemat kuota ternakan lu!
        })
      });

      const data = await response.json();
      if (!response.ok) return res.status(response.status).json({ error: data.message || 'Key Freepik salah atau jatah kuota akun gratisan lu abis.' });
      return res.status(200).json(data);
    }

    res.status(400).json({ error: 'Provider tidak dikenali' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
          }
