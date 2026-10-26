
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DATABASE || "rare";

app.use(express.json());

// Allow local development and deployed requests.
// Vercel deployments use the same-origin API route.
app.use((req, res, next) => {
  const allowedOrigin = process.env.FRONTEND_ORIGIN;

  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  } else if (
    req.headers.origin === "http://localhost:8080" ||
    req.headers.origin === "http://localhost:3000"
  ) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

let db;
let mongoClient;

app.get("/api/products", async (req, res) => {
  try {
    const products = await db
      .collection("products")
      .find({})
      .toArray();

    res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

async function startServer() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing");
  }

  mongoClient = new MongoClient(MONGODB_URI);
  await mongoClient.connect();

  db = mongoClient.db(DATABASE_NAME);
  console.log("Connected to MongoDB Atlas");

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
