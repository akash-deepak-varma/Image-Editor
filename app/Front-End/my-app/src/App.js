import React, { useState } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputImage, setInputImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [editedImage, setEditedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setInputImage(URL.createObjectURL(file)); // Create URL for the uploaded image
    setError(null); // Clear any previous errors
  };

  const extractColorPalette = async () => {
    if (!selectedFile) {
      return alert("Please upload an image first.");
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/api/color-palette", formData);
      setColors(response.data.colorPalette || []); // Ensure it's an array
    } catch (error) {
      console.error("Error extracting color palette:", error);
      setError(`Failed to extract color palette. Please try again. {Error: ${error.message} }`);
    }
  };

  const changeBackground = async () => {
    if (!selectedFile) {
      return alert("Please upload an image first.");
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/api/background-change", formData, {
        responseType: "blob",
      });

      const imageBlob = new Blob([response.data], { type: "image/png" });
      setEditedImage(URL.createObjectURL(imageBlob));
      setError(null); // Clear any errors on success
    } catch (error) {
      console.error("Error changing background:", error);
      setError("Failed to change background. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Image Editing Tool</h1>
      <Dropzone onDrop={handleFileUpload}>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #888",
              padding: "20px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            {selectedFile ? (
              <p>Uploaded: {selectedFile.name}</p>
            ) : (
              <p>Drag and drop an image, or click to upload.</p>
            )}
          </div>
        )}
      </Dropzone>

      <button onClick={extractColorPalette} style={{ margin: "10px" }}>
        Extract Color Palette
      </button>
      <button onClick={changeBackground}>Change Background</button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

    <div style={{ marginTop: "20px", display: "flex", flexDirection: "row", }}>
    {inputImage && (
        <div style={{ marginTop: "20px" }}>
          <h2>Uploaded Image</h2>
          <div style={{width: "40%", height: "40%", }}>
          <img src={inputImage} alt="Uploaded" style={{ maxWidth: "100%" }} />
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div style={{ marginTop: "40px", marginLeft: "60px", alignItems: "center"  }}>
          <h2>Color Palette</h2>
          <div style={{ display: "flex" }}>
            {colors.map((color, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: color,
                  width: "50px",
                  height: "50px",
                  margin: "5px",
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
     

      {editedImage && (
        <div>
          <h2>Edited Image</h2>
          <img src={editedImage} alt="Edited" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default App;
