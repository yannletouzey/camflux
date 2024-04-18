const video = document.getElementById('videoElement');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const toggleButton = document.getElementById('toggleButton');
let stream;

toggleButton.addEventListener('click', function() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    toggleButton.textContent = 'Start Cam';
    video.addEventListener('paused', drawFrame);
  } else {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(streamObj) {
        stream = streamObj;
        video.srcObject = stream;
        toggleButton.textContent = 'Stop Cam';
        video.addEventListener('play', drawFrame);
      })
      .catch(function(error) {
        console.log("Something went wrong!", error);
      });
    }
  }
});
let asciiDiv = document.getElementById('ascii');
let size = window.innerWidth;

asciiDiv.style.width = `${size}px`;
let fontSize = (asciiDiv.clientWidth / 100 * 5.5) / 10;
console.log(fontSize);
addEventListener('resize', () => {
  size = window.innerWidth;
  asciiDiv.style.width = `${size}px`;
  fontSize = (asciiDiv.clientWidth  / 100 * 5.5) / 10;
})
function displayAscii(asciiImage) {
  asciiDiv.textContent = asciiImage;
  asciiDiv.style.whiteSpace = 'pre';
  asciiDiv.style.fontFamily = 'monospace';
  asciiDiv.style.fontSize = `${fontSize}px`;
  addEventListener('resize', () => {
    asciiDiv.style.fontSize = `${fontSize}px`;
  })
}
function drawFrame() {
  if(video.paused || video.ended) return;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const asciiArt = processPixelsToAscii();
  displayAscii(asciiArt);
  requestAnimationFrame(drawFrame);
}

const asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'];
function processPixelsToAscii() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let asciiImage = '';
  for (let y = 0; y < canvas.height; y++) {
    let asciiLine = '';
    for (let x = 0; x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const gray = 0.299 * red + 0.587 * green + 0.114 * blue;
      
      const charIndex = Math.floor(gray * (asciiChars.length / 255));
      asciiLine += asciiChars[charIndex];
    }
    asciiImage += asciiLine + '\n';
  }
  return asciiImage;
}