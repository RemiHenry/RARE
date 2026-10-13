const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve all static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Route to serve the JSON file
app.get("/api/products", (req, res) => {
  const filePath = path.join(__dirname, "rare-products.json");

  // Read the file asynchronously
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Failed to read data file" });
    }

    try {
      // Parse the string into a valid JavaScript object
      const jsonData = JSON.parse(data);

      // Send the object back as a proper JSON response
      res.json(jsonData);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).json({ error: "Invalid JSON format in file" });
    }
  });
});
