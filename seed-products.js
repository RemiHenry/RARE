const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DATABASE || "rare";

async function seedProducts() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing");
  }

  const filePath = path.join(__dirname, "rare-products.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);

  if (!Array.isArray(data.products)) {
    throw new Error('The JSON file must contain a "products" array');
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    const db = client.db(DATABASE_NAME);
    const collection = db.collection("products");

    for (const product of data.products) {
      await collection.updateOne(
        { id: product.id },
        { $setOnInsert: product },
        { upsert: true },
      );
    }

    console.log(`Processed ${data.products.length} products.`);
    console.log("Existing products were not overwritten.");
  } finally {
    await client.close();
  }
}

seedProducts().catch((error) => {
  console.error("Failed to import products:", error.message);
  process.exitCode = 1;
});
