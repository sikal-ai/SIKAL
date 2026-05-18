let apiKey = localStorage.getItem('freepik_api_key');

window.onload = () => {
  if (apiKey) {
    showTools();
  }
}

function saveApiKey() {
  apiKey = document.getElementById('freepik-api-key').value.trim();
  if (!apiKey.startsWith('fp_')) {
    alert('API key Freepik harus diawali fp_');
    return;
  }
  localStorage.setItem('freepik_api_key', apiKey);
  showTools();
}

function showTools() {
  document.getElementById('api-key-section').classList.add('hidden');
  document.getElementById('tool-section').classList.remove('hidden');
}

function logout() {
  localStorage.removeItem('freepik_api_key');
  location.reload();
}

async function generate() {
  const btn = document.getElementById('generate-btn');
  const tool = document.getElementById('tool-select').value;
  const prompt = document.getElementById('prompt').value;
  const file = document.getElementById('image-upload').files[0];
  const resultDiv = document.getElementById('result');

  if (!file) return alert('Upload gambar dulu');

  btn.disabled = true;
  btn.textContent = 'Processing...';
  resultDiv.innerHTML = 'Loading... tunggu 10-30 detik';

  try {
    let endpoint = '';
    let body = {};

    if (tool === 'kling-video') {
      endpoint = 'https://api.freepik.com/v1/ai/kling/image-to-video';
      body = {
        prompt: prompt || 'animate it smoothly',
        image: await fileToBase64(file),
        duration: 5
      };
    }

    if (tool === 'luma-video') {
      endpoint = 'https://api.freepik.com/v1/ai/luma/image-to-video';
      body = {
        prompt: prompt || 'make it move naturally',
        image: await fileToBase64(file),
        duration: 5
      };
    }

    if (tool === 'magnific-upscale') {
      endpoint = 'https://api.freepik.com/v1/ai/magnific/upscale';
      body = {
        image: await fileToBase64(file),
        scale: 2
      };
    }

    if (tool === 'magnific-relight') {
      endpoint = 'https://api.freepik.com/v1/ai/magnific/relight';
      body = {
        image: await fileToBase64(file),
        prompt: prompt || 'professional studio lighting'
      };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'API error: ' + res.status);
    }

    const data = await res.json();
    const mediaUrl = data.data[0].url;
    resultDiv.innerHTML = mediaUrl.includes('.mp4')
    ? `<video src="${mediaUrl}" controls autoplay loop></video>`
      : `<img src="${mediaUrl}" alt="result">`;

  } catch (err) {
    resultDiv.innerHTML = 'Error: ' + err.message;
  }

  btn.disabled = false;
  btn.textContent = 'Generate';
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
