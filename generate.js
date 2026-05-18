const btn = document.getElementById('genBtn');
const status = document.getElementById('status');
const result = document.getElementById('result');
const apiKeyInput = document.getElementById('userApiKey');

// Load API key dari localStorage pas page dibuka
window.onload = () => {
  const savedKey = localStorage.getItem('magnific_api_key');
  if (savedKey) apiKeyInput.value = savedKey;
};

// Simpen API key otomatis pas user ngetik
apiKeyInput.addEventListener('input', () => {
  localStorage.setItem('magnific_api_key', apiKeyInput.value.trim());
});

btn.addEventListener('click', async () => {
  const apiKey = apiKeyInput.value.trim();
  const prompt = document.getElementById('prompt').value.trim();
  const resolution = document.getElementById('resolution').value;
  const style = document.getElementById('style').value;
  const seed = document.getElementById('seed').value;

  if (!apiKey || !prompt) {
    alert('API key dan prompt wajib diisi');
    return;
  }

  btn.disabled = true;
  status.innerHTML = '<span class="loading">Generating...</span>';
  result.innerHTML = '';

  try {
    const res = await fetch('https://api.magnific.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        resolution: resolution,
        style: style,
        seed: seed ? parseInt(seed) : undefined
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || `Error ${res.status}`);
    }

    status.innerText = 'Selesai!';
    result.innerHTML = `
      <img src="${data.image_url}" id="resultImg" style="max-width:100%; border-radius:8px;">
      <br><br>
      <button onclick="downloadImg('${data.image_url}')">Download Gambar</button>
    `;

  } catch (err) {
    status.innerText = 'Gagal';
    result.innerHTML = `<p style="color:red;">${err.message}</p>`;
  } finally {
    btn.disabled = false;
  }
});

// Fungsi download
function downloadImg(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = 'magnific_result.png';
  a.click();
}

// Cek credits API key
