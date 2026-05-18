export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tool, prompt, image, apiKey } = req.body;

  if (!apiKey ||!apiKey.startsWith('FPSX')) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  let endpoint = '';
  let body = {};

  if (tool === 'kling-video') {
    endpoint = 'https://api.freepik.com/v1/ai/kling/image-to-video';
    body = { prompt: prompt || 'animate it smoothly', image, duration: 5 };
  }

  if (tool === 'luma-video') {
    endpoint = 'https://api.freepik.com/v1/ai/luma/image-to-video';
    body = { prompt: prompt || 'make it move naturally', image, duration: 5 };
  }

  if (tool === 'magnific-upscale') {
    endpoint = 'https://api.freepik.com/v1/ai/magnific/upscale';
    body = { image, scale: 2 };
  }

  if (tool === 'magnific-relight') {
    endpoint = 'https://api.freepik.com/v1/ai/magnific/relight';
    body = { image, prompt: prompt || 'professional studio lighting' };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
