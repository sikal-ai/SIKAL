export default async function handler(req, res) {
  const { requestId, apiKey } = req.query;
  
  if (!apiKey || !apiKey.startsWith('fal_')) {
    return res.status(400).json({ error: 'Invalid API key' });
  }

  try {
    const response = await fetch(`https://fal.run/fal-ai/kling-video/v1/requests/${requestId}/status`, {
      headers: { 'Authorization': `Key ${apiKey}` }
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}