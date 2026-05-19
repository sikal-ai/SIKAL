document.getElementById('apiForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const apiKey = document.getElementById('apiKey').value.trim();
  const prompt = document.getElementById('prompt').value.trim();
  const resultDiv = document.getElementById('result');
  
  if (!apiKey.startsWith('fal_')) {
    alert('API key salah! Harus diawali fal_');
    return;
  }
  
  if (!prompt) {
    alert('Isi prompt dulu!');
    return;
  }
  
  resultDiv.innerHTML = '<p>⏳ Mengirim request...</p>';
  
  try {
    // Step 1: Kirim ke backend lu
    const genRes = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        api_key: apiKey, 
        prompt: prompt 
      })
    });
    
    const genData = await genRes.json();
    
    if (genData.error) {
      resultDiv.innerHTML = `<p style="color:red;">Error: ${genData.error}</p>`;
      return;
    }
    
    const requestId = genData.request_id;
    resultDiv.innerHTML = '<p>🎬 Video lagi diproses, tunggu 30-60 detik...</p>';
    
    // Step 2: Cek status tiap 5 detik sampe jadi
    const interval = setInterval(async () => {
      const statusRes = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          api_key: apiKey, 
          request_id: requestId 
        })
      });
      
      const statusData = await statusRes.json();
      
      if (statusData.status === 'COMPLETED') {
        clearInterval(interval);
        resultDiv.innerHTML = `
          <p>✅ Selesai!</p>
          <video src="${statusData.video_url}" controls width="100%"></video>
        `;
      } else if (statusData.status === 'FAILED') {
        clearInterval(interval);
        resultDiv.innerHTML = `<p style="color:red;">Gagal: ${statusData.error}</p>`;
      }
      
    }, 5000);
    
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
});
