export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, apiKey } = req.body;

    if (!apiKey) return res.status(400).json({ error: 'API Key required' });
    if (!prompt) return res.status(400).json({ error: 'Prompt required' });

    const response = await fetch('https://api.fal.ai/v1/video/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        duration: 5,
        aspect_ratio: '16:9'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.detail || 'Failed to generate' });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}