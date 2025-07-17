const video = document.getElementById('webcam');
const statusText = document.getElementById('status');

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    statusText.textContent = "Camera is live!";
  } catch (err) {
    console.error("Error accessing camera:", err.name, err.message);
    statusText.textContent = `Error: ${err.name} — ${err.message}`;
  }
}

startCamera();
