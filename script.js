const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');

let src, gray;
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

      cap = new cv.VideoCapture(video);

      statusText.textContent = "Camera is live! Showing grayscale video...";
      processFrame();
    };
  } catch (err) {
    console.error(err);
    statusText.textContent = `Error: ${err.name}`;
  }
};

function processFrame() {
  if (src.cols !== video.videoWidth || src.rows !== video.videoHeight) {
    console.log("Recreating Mats due to size mismatch");
    src.delete();
    gray.delete();

    src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
    gray = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC1);
  }

  cap.read(src);
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.imshow('canvas', gray);
  requestAnimationFrame(processFrame);

  console.log("Video size:", video.videoWidth, video.videoHeight);
  console.log("Mat size:", src.cols, src.rows);
}
