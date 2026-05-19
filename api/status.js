export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { request_id, apiKey, provider } = req.body;

    if (provider === 'fal') {
      if (!request_id) return res.status(400).json({ error: 'ID Request antrean tidak ditemukan.' });

      const response = await fetch(`https://queue.fal.run/fal-ai/kling-video/v1.5/standard/image-to-video/requests/${request_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      return res.status(200).json(data);
    }

    // Kalau pake Magnific/Freepik gak butuh interval status karena biasanya langsung ngasih video instan
    res.status(200).json({ status: 'COMPLETED' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
