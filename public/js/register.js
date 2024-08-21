document.getElementById("uploadBtn").addEventListener("click", function () {
    var fileInput = document.getElementById("image");
    var uploadStatus = document.getElementById("uploadStatus");
    var imageContainer = document.getElementById("imageContainer");
  
    // Clear previous uploaded images
    imageContainer.innerHTML = "";
  
    // Check if no files are selected
    if (fileInput.files.length === 0) {
      uploadStatus.textContent = "Please select one image to upload.";
      return;
    }
  
    // Check if more than 10 files are selected
    if (fileInput.files.length > 1) {
      uploadStatus.textContent = "You can only upload one image.";
      return;
    }
  
    uploadStatus.textContent = "Uploading...";
  
    // Function to handle the FileReader operation for each file
    var handleFile = function (file) {
      var reader = new FileReader();
  
      reader.onload = function (event) {
        // Create a div for each uploaded image
        var div = document.createElement("div");
        div.className = "uploaded-image";
  
        // Create an img element and set its src to the uploaded image
        var img = document.createElement("img");
        img.src = event.target.result;
  
        // Append the img to the div
        div.appendChild(img);
  
        // Append the div to the image container
        imageContainer.appendChild(div);
      };
  
      reader.readAsDataURL(file);
    };
  
    // Iterate over each selected file and handle it
    for (var i = 0; i < fileInput.files.length; i++) {
      handleFile(fileInput.files[i]);
    }
  
    uploadStatus.textContent = "Upload successful!";
  });