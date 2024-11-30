import React, { useState } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [colors, setColors] = useState([]);
  const [editedImage, setEditedImage] = useState(null);

  const handleFileUpload = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const extractColorPalette = async () => {
    if (!selectedFile) return alert("Upload Image ");

    const formData = new FormData();
    formData.append("image", selectedFile);

    const response = await axios.post("http://localhost:5000/api/color-palette", formData);
    setColors(response.data.colors);
  };

  const changeBackground = async () => {
    if (!selectedFile) return alert("Please upload an image first.");

    const formData = new FormData();
    formData.append("image", selectedFile);

    const response = await axios.post("http://localhost:5000/api/background-change", formData, {
      responseType: "blob",
    });

    const imageBlob = new Blob([response.data], { type: "image/png" });
    setEditedImage(URL.createObjectURL(imageBlob));
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

      {colors.length > 0 && (
        <div>
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
