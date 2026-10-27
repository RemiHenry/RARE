
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DATABASE || "rare";

app.use(express.json());

let db;

const mongoClient = MONGODB_URI
  ? new MongoClient(MONGODB_URI)
  : null;

const dbReady = mongoClient
  ? mongoClient.connect().then((client) => {
      db = client.db(DATABASE_NAME);
      console.log("Connected to MongoDB Atlas");
    })
  : Promise.reject(new Error("MONGODB_URI is missing"));

dbReady.catch((error) => {
  console.error("MongoDB connection failed:", error.message);
});

app.get("/api/products", async (req, res) => {
  try {
    await dbReady;

    const products = await db
      .collection("products")
      .find({})
      .toArray();

    res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Start a normal HTTP server for local Docker development only.
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the Express app for Vercel.
module.exports = app;
