export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { request_id, apiKey } = req.body;

    if (!apiKey) return res.status(400).json({ error: 'API Key required' });

    const response = await fetch(`https://api.fal.ai/v1/video/generation/${request_id}`, {
      headers: {
        'Authorization': `Key ${apiKey}`
      }
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}