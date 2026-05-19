const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/api/generate', async (req, res) => {
  const { api_key, prompt } = req.body;
  const response = await fetch('https://api.fal.ai/v1/kling-video/v1.0/standard/generate', {
    method: 'POST',
    headers: { 'Authorization': `Key ${api_key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, duration: 5, resolution: "1080p" })
  });
  res.json(await response.json());
});

app.post('/api/status', async (req, res) => {
  const { api_key, request_id } = req.body;
  const response = await fetch(`https://api.fal.ai/v1/kling-video/v1.0/standard/requests/${request_id}`, {
    headers: { 'Authorization': `Key ${api_key}` }
  });
  res.json(await response.json());
});

app.listen(3000, () => console.log('Server jalan'));
