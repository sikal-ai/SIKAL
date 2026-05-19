export default async function handler(req, res) {
  // Setel Header biar APK / Domain luar bisa bebas akses tanpa eror CORS
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
      if (!response.ok) return res.status(response.status).json({ error: data.detail || 'Akun Fal.ai lu bermasalah atau abis saldo.' });
      return res.status(200).json(data);
    } 
    
    // ================= JALUR 2: MAGNIFIC / FREEPIK (KEY FPSX) =================
    else if (provider === 'freepik') {
      // Map model dari UI ke parameter text Magnific API
      let apiModel = 'kling_3_0';
      if (modelType === 'kling_std') apiModel = 'kling_3_0_standard';
      if (modelType === 'minimax_2_3') apiModel = 'minimax_2_3';
      if (modelType === 'pixverse_5_5') apiModel = 'pixverse_5_5';

      // Nembak langsung ke endpoint resmi Magnific Developer
      const response = await fetch('https://api.magnific.com/v1/image-to-video', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}` // Wajib pake format Bearer buat key FPSX
        },
        body: JSON.stringify({
          prompt: prompt,
          image_url: imageUrl, // Magnific nerima URL gambar langsung / base64 terenkapsulasi
          model: apiModel,
          audio: false // KUNCI MATI: Biar video hasil generate bisu/tanpa suara, hemat kuota!
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json({ 
          error: data.message || 'Key Magnific/Freepik lu salah, atau kuota akun gratisan lu udah abis, cok.' 
        });
      }
      
      // Kirim hasil link video mateng balik ke APK/index.html lu
      return res.status(200).json(data);
    }

    res.status(400).json({ error: 'Provider tidak dikenali' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
