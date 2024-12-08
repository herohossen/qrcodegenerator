document.getElementById("generateBtn").addEventListener("click", generateQRCode);
document.getElementById("qrInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    generateQRCode();
  }
});

document.getElementById("logoUpload").addEventListener("change", function(event) {
  var file = event.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      window.logoImage = new Image();
      window.logoImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function generateQRCode() {
  var inputText = document.getElementById("qrInput").value;

  if (inputText.trim() === "") {
    alert("Please enter text or URL.");
    return;
  }

  // Clear any previous QR code and logo
  document.getElementById("qrcode").innerHTML = "";

  // Generate the QR code using the input text
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    text: inputText,
    width: 200,
    height: 200,
    correctLevel: QRCode.CorrectLevel.H,
    callback: function() {
      var canvas = document.querySelector("#qrcode canvas");
      if (canvas && window.logoImage) {
        overlayLogo(canvas);
      }
    }
  });

  // Enable the download button once the QR code is generated
  setTimeout(function() {
    var canvas = document.querySelector("#qrcode canvas");
    if (canvas) {
      var downloadBtn = document.getElementById("downloadBtn");
      downloadBtn.classList.remove("hidden");

      // Set the download URL and filename
      downloadBtn.href = canvas.toDataURL("image/png");
      downloadBtn.download = "qrcode_with_logo.png";  // Set default download filename
    }
  }, 500);  // Give some time for the QR code to be rendered
}

function overlayLogo(canvas) {
  var ctx = canvas.getContext("2d");

  // Resize the logo to fit into the center of the QR code
  var logoSize = 50;
  var logoX = (canvas.width - logoSize) / 2;
  var logoY = (canvas.height - logoSize) / 2;

  // Draw the logo on the canvas
  ctx.drawImage(window.logoImage, logoX, logoY, logoSize, logoSize);
}
