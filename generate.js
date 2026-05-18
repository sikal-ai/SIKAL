export default async function handler(req, res) {
    // Header CORS biar browser HP lu kagak ngamuk diblokir
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Mesti pake POST, cok!' });
    }

    const { apiKey, prompt, image, model } = req.body;

    try {
        // SUDAH DIGABUNG DAN DIPERBAIKI: Menggunakan format gabungan string yang aman dari typo
        const response = await globalThis.fetch('https://api.freepik.com/v1/ai/video-generation', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model || "kling-3.0",
                prompt: prompt,
                image: image,
                negative_prompt: "low quality, blurry, deformed, airbrushed, beauty filter, over-smoothed skin texture",
                duration: 5
            })
        });

        const textData = await response.text();
        
        try {
            const jsonData = JSON.parse(textData);
            return res.status(response.status).json(jsonData);
        } catch (e) {
            return res.status(response.status).json({ serverResponse: textData });
        }

    } catch (err) {
        return res.status(500).json({ error: "Gagal nembak Freepik: " + err.message });
    }
}

