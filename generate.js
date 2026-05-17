export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Mesti pake POST, cok!' });

    const { apiKey, prompt } = req.body;

    try {
        const response = await fetch('https://api.freepik.com/v1/ai/video-generation', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "kling-3.0",
                prompt: prompt,
                negative_prompt: "cinematic, artificial, background blur, bokeh",
                duration: 5
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Gagal menyambung ke Freepik" });
    }
}
