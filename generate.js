export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { apiKey, video, prompt } = req.body;
  
  if (!apiKey || !apiKey.startsWith('fal_')) {
    return res.status(400).json({ error: 'Invalid API key' });
  }

  try {
    const response = await fetch('https://fal.run/fal-ai/kling-video/v1/master/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: video,
        prompt: prompt,
        duration: 5
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}