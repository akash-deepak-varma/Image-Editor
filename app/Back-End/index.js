const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const path = require("path");
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for Color Palette Extraction

app.post("/api/color-palette", upload.single("image"), (req, res) => {
    const colors=5;
    try {
        const imageBuffer = req.file.buffer;

        /*
        // Generate a unique file path for the input image
        const inputFilePath = path.join(__dirname, 'uploads', `input_image_${Date.now()}.png`);

        // Write the uploaded image to the input file
        fs.writeFileSync(inputFilePath, imageBuffer);

       
        // Construct the Python command (no output file needed)
        const pythonCommand = `python3 "${path.join(__dirname, 'features.py')}" extract_color_palette "${imageBuffer}" "${colors}"`;

        // Execute the Python script
        exec(pythonCommand, (error, stdout, stderr) => {
            // Handle errors
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).send('Error processing the image.');
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return res.status(500).send(`Script stderr: ${stderr}`);
            }

            console.log(`Script stdout: ${stdout}`); // Log the script output

            // Parse the color palette directly from stdout
            let colorPalette;

            try {
                colorPalette = JSON.parse(stdout); // Ensure Python outputs valid JSON
            } catch (parseError) {
                console.error(`Failed to parse color palette: ${parseError.message}`);
                return res.status(500).send("Error parsing color palette output.");
            }

            // Clean up temporary input file
            fs.unlinkSync(inputFilePath);

            // Send the color palette as the response
            res.json(colorPalette);
        }); */
const inputFilePath = path.resolve(__dirname, 'uploads', `input_image_${Date.now()}.png`);
const outputFilePath = path.resolve(__dirname, 'uploads', `color_palette_${Date.now()}.json`);

fs.writeFileSync(inputFilePath, imageBuffer);

const pythonCommand = `python3 "${path.resolve(__dirname, 'features.py')}" extract_color_palette "${inputFilePath}" "${outputFilePath}"`;

console.log("Executing Python Command:", pythonCommand);

exec(pythonCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Execution error: ${error}`);
        return res.status(500).send('Error processing the image.');
    }
    if (stderr) {
        console.error(`Script error: ${stderr}`);
        return res.status(500).send(`Python error: ${stderr}`);
    }

    console.log(`Script Output: ${stdout}`);
    try {
        ///const colorPalette = ["#FF5733", "#33FF57", "#5733FF"]; 
        //res.json({ colors });
        const colorPalette = JSON.parse(stdout.trim()); // Parse JSON output
        console.log(`Parsed Color Palette: ${colorPalette}`);
        res.json({colorPalette});
    } catch (parseError) {
        console.error(`Parsing error: ${parseError.message}`);
        res.status(500).send("Error parsing the color palette.");
    }
});

    } catch (error) {
        console.error(error);
        res.status(500).send("Error processing image.");
    }
});


// Route for Background Change
app.post("/api/background-change", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;

    // Use Sharp to modify the background (dummy processing)
    const modifiedImage = await sharp(imageBuffer)
      .resize(800, 600)
      .toBuffer();

    res.set("Content-Type", "image/png");
    res.send(modifiedImage);
  } catch (error) {
    res.status(500).send("Error processing background.");
  }
});


app.post('/process-image', upload.single('image'), (req, res) => {
    const imagePath = req.file.path;
    const outputPath = `uploads/output_${req.file.filename}.png`;

    // Define the function you want to call, e.g., 'remove_bg'
    const functionName = req.body.functionName || 'remove_bg';  // Default to 'remove_bg'

    // Execute Python script based on the function requested
    exec(`python3 app.py ${functionName} ${imagePath} ${outputPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error processing the image');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error processing the image');
        }

        // Send the processed image back to the client
        res.sendFile(path.resolve(outputPath), (err) => {
            if (err) {
                console.error('Error sending the file:', err);
                res.status(500).send('Error sending the file');
            }
            // Clean up uploaded files
            fs.unlinkSync(imagePath);
            fs.unlinkSync(outputPath);
        });
    });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
