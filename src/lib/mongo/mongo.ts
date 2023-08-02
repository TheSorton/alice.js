import { Client } from "discord.js";
import { mongoSchema } from "./schema";
import { textColor } from "../colors";
import mongoose from "mongoose";

/**
 * ping a MongoDB deployment with mongoose
 */
export async function pingMongoDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/alice", {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(
      `${textColor.fgGreen}✅ Successfully connected to MongoDB.${textColor.reset}`
    );
    return true;
  }
  catch (e) {
    console.error(
      `${textColor.fgRed}❌ Unable to connect to MongoDB. Disabling MongoDB features.${textColor.reset}`
    );
    return false;
  }
}

/**
 * Create a MongoDB collection using mongoose that first checks if the user is in the collection.
 * @param client - The readied Discord client
 */
export async function createMongoCollection(client: Client) {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect("mongodb://localhost:27017/alice", {
        serverSelectionTimeoutMS: 3000,
      });
  }
    const User = mongoose.model("User", mongoSchema);
    if (
      await User.findOne({
        userID: client.user.id,
      })
    ) {
      console.log(
        `${textColor.fgGreen}✅ The bot is already in the alice.users collection. Moving on...${textColor.reset}`
      );
    }
    else {
      const newUser = new User({
        userID: client.user.id,
        username: client.user.username,
        created: client.user.createdAt,
        lastUpdated: new Date(),
      });
      await newUser.save();
      console.log(
        `${textColor.fgGreen}✅ Created and added the bot to the alice.users collection.${textColor.reset}`
      );
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * queries a MongoDB collection
 * @param {string} db - The database to query
 * @param {string} collection - The collection to query
 * @param {object} query - The query to run
 * @param {MongoClient} mClient - The MongoClient to use
 */
export async function queryMongoCollection(
  db: string,
  collection: string,
  query: object,
  mClient
) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await mClient.connect();
    // Send a ping to confirm a successful connection
    const result = await mClient.db(db).collection(collection).findOne(query);
    //console.log(result);
    return result;
  } finally {
    // Ensures that the client will close when you finish/error
    await mClient.close();
  }
}

export async function addToMongoCollection(mClient, query: object) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await mClient.connect();
    // Send a ping to confirm a successful connection
    await mClient.db("alice").collection("users").insertOne(query);
    //console.log("${fg} Added a user to the collection.");
  } finally {
    // Ensures that the client will close when you finish/error
    await mClient.close();
  }
}
