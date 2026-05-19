export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { request_id, apiKey } = req.body;

    if (!request_id) return res.status(400).json({ error: 'Request ID required' });
    if (!apiKey) return res.status(400).json({ error: 'API Key required' });

    // Disesuaikan dengan endpoint status Kling V1.5 Standard
    const response = await fetch(`https://queue.fal.run/fal-ai/kling-video/v1.5/standard/image-to-video/requests/${request_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ error: data.detail || 'Gagal mengecek status ke Fal.ai' });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
