export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Mesti pake POST, cok!' });

    // Sekarang kita terima kiriman data 'image' (Base64) dari frontend index.html
    const { apiKey, prompt, image } = req.body;

    try {
        // Susun body request sesuai dokumentasi Image-to-Video Freepik/Kling AI
        const requestBody = {
            model: "kling-3.0",
            prompt: prompt,
            negative_prompt: "low quality, blurry, deformed, airbrushed, beauty filter, over-smoothed skin texture",
            duration: 5
        };

        // Kalau user upload foto, kita masukin datanya ke parameter 'image'
        if (image) {
            requestBody.image = image;
        }

        const response = await fetch('https://api.freepik.com/v1/ai/video-generation', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Gagal menyambung ke Freepik, server tumbang atau API key salah!" });
    }
}
