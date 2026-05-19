export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, imageUrl, apiKey, aspect_ratio, duration } = req.body;

    if (!apiKey) return res.status(400).json({ error: 'API Key required' });
    if (!imageUrl) return res.status(400).json({ error: 'Image URL/Base64 required' });
    if (!prompt) return res.status(400).json({ error: 'Prompt required' });

    // Memakai endpoint resmi Kling 5.1 Pro Image-to-Video di Fal.ai
    const response = await fetch('https://queue.fal.run/fal-ai/kling-video/v5.1/pro/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        image_url: imageUrl,
        duration: duration === 10 ? "10" : "5", // Kling minta format string untuk durasi pro
        aspect_ratio: aspect_ratio || '16:9'
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.detail || 'Gagal terhubung ke Kling Fal.ai' });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
