const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');

let src, gray, edges;
let cap;

cv['onRuntimeInitialized'] = async () => {
  statusText.textContent = "Loading camera...";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
      gray = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC1);
      edges = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC1);

      cap = new cv.VideoCapture(video);

      statusText.textContent = "Camera is live! Applying edge detection...";
      processFrame();
    };
  } catch (err) {
    console.error(err);
    statusText.textContent = `Error: ${err.name}`;
  }
};

function processFrame() {
  cap.read(src);
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.Canny(gray, edges, 50, 150, 3, false);
  cv.imshow('canvas', edges);
  requestAnimationFrame(processFrame);
}
