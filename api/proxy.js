export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  const r = await fetch("https://api.magnific.ai/v1/generate", {
    method: "POST",
    headers: { 
      "Authorization": "Bearer " + process.env.MAGNIFIC_API_KEY, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(req.body)
  });
  
  const data = await r.json();
  res.status(200).json(data);
}
