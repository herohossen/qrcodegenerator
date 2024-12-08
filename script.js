// Elements
const qrInput = document.getElementById("qrInput");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const logoUpload = document.getElementById("logoUpload");
const qrcodeContainer = document.getElementById("qrcode");

// Function to generate QR Code
generateBtn.addEventListener("click", () => {
  const qrText = qrInput.value.trim();

  if (qrText === "") {
    alert("Please enter text or URL to generate the QR Code.");
    return;
  }

  // Clear previous QR code
  qrcodeContainer.innerHTML = "";

  // Generate QR code with black foreground and white background
  new QRCode(qrcodeContainer, {
    text: qrText,
    width: 200,
    height: 200,
    correctLevel: QRCode.CorrectLevel.L,
    colorDark: "#000000", // Black foreground
    colorLight: "#ffffff", // White background
  });

  // Show the download button
  downloadBtn.classList.remove("hidden");
});

// Function to handle QR Code download
downloadBtn.addEventListener("click", () => {
  const qrCanvas = qrcodeContainer.querySelector("canvas");
  if (!qrCanvas) {
    alert("Please generate the QR Code first!");
    return;
  }

  // Create a new canvas with white background
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const qrWidth = qrCanvas.width;
  const qrHeight = qrCanvas.height;

  canvas.width = qrWidth;
  canvas.height = qrHeight;

  // Fill the canvas with a white background
  context.fillStyle = "#ffffff"; // White background
  context.fillRect(0, 0, qrWidth, qrHeight);

  // Draw the QR code onto the new canvas
  context.drawImage(qrCanvas, 0, 0);

  // Add logo if uploaded
  if (logoUpload.files.length > 0) {
    const logo = logoUpload.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const logoImg = new Image();
      logoImg.src = event.target.result;

      logoImg.onload = () => {
        const logoSize = qrWidth / 5; // Logo is 1/5th of the QR code width
        const logoX = (qrWidth - logoSize) / 2;
        const logoY = (qrHeight - logoSize) / 2;

        // Draw the logo on top of the QR code
        context.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

        // Trigger download
        triggerDownload(canvas);
      };
    };

    reader.readAsDataURL(logo);
  } else {
    // Trigger download directly if no logo is uploaded
    triggerDownload(canvas);
  }
});

// Function to trigger download
function triggerDownload(canvas) {
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}${now.getMilliseconds()}`;
  const filename = `qrcode_${timestamp}.jpg`;

  if (canvas.toBlob) {
    // Use toBlob for modern browsers
    canvas.toBlob(
      (blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      },
      "image/jpeg",
      1.0 // Quality (1.0 = maximum)
    );
  } else {
    // Fallback to toDataURL for older browsers
    const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }
}
