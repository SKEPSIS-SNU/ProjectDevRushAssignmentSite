// migrate.js
const fs = require("fs");
const { MongoClient } = require("mongodb");

// MongoDB connection URI - Update with your connection string
const uri = "";
const dbName = "project_db"; // Update with your database name
const collectionName = "users";

async function migrateData() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Read and parse the TSV data
    const data = fs.readFileSync("data.txt", "utf8");
    const lines = data
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.split("\t"));

    // Create a map to store unique users
    const usersMap = new Map();

    lines.forEach(([email, name, track]) => {
      if (!email || !name || !track) return; // Skip invalid entries

      // If user doesn't exist, create new entry
      if (!usersMap.has(email)) {
        usersMap.set(email, {
          name: name.trim(),
          email: email.trim(),
          track: track.includes("Machine Learning") ? "ml" : "web",
          submissions: [],
        });
      }
    });

    // Convert map to array of users
    const users = Array.from(usersMap.values());

    // Insert users into MongoDB
    if (users.length > 0) {
      // Drop existing collection if it exists
      await collection
        .drop()
        .catch(() => console.log("Collection did not exist"));

      // Insert the new documents
      const result = await collection.insertMany(users);
      console.log(`Successfully inserted ${result.insertedCount} users`);

      // Create an index on email field for faster lookups
      await collection.createIndex({ email: 1 }, { unique: true });
      console.log("Created unique index on email field");
    }
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

// Run the migration
migrateData().catch(console.error);
