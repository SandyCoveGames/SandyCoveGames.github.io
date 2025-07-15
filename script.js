const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      processFrame();
    });
    statusText.textContent = "Camera is live! Applying edge detection...";
  } catch (err) {
    console.error(err);
    statusText.textContent = `Error: ${err.name}`;
  }
}

function processFrame() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = frame.data;

  // Simple grayscale and edge-like effect (very basic)
  for (let i = 0; i < data.length; i += 4) {
    let avg = (data[i] + data[i+1] + data[i+2]) / 3;
    data[i] = data[i+1] = data[i+2] = avg;
  }

  // Simple horizontal difference to simulate edge detection
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 1; x < canvas.width; x++) {
      let i = (y * canvas.width + x) * 4;
      let prev = (y * canvas.width + (x-1)) * 4;
      let diff = Math.abs(data[i] - data[prev]);
      data[i] = data[i+1] = data[i+2] = diff > 20 ? 255 : 0;
    }
  }

  ctx.putImageData(frame, 0, 0);
  requestAnimationFrame(processFrame);
}

startCamera();
