const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');

cv['onRuntimeInitialized'] = async () => {
  statusText.textContent = "Loading camera...";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      statusText.textContent = "Camera is live! Applying edge detection...";
      startProcessing();
    };
  } catch (err) {
    console.error(err);
    statusText.textContent = `Error: ${err.name}`;
  }
};

function startProcessing() {
  // Create OpenCV Mats
  let src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
  let gray = new cv.Mat();
  let edges = new cv.Mat();
  let cap = new cv.VideoCapture(video);

  function processFrame() {
    cap.read(src);                         // Read frame from video
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY); // Convert to grayscale
    cv.Canny(gray, edges, 50, 150, 3, false);   // Apply Canny edge detection
    cv.imshow('canvas', edges);            // Show result on canvas
    requestAnimationFrame(processFrame);   // Repeat
  }

  processFrame();
}
