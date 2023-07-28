import { Client } from "discord.js";
import { mongoSchema } from "./schema";
import { textColor } from "../colors";

/**
 * ping a MongoDB deployment
 * @param mClient - The MongoClient to use
 */
export async function pingMongoDB(mClient) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await mClient.connect();
    // Send a ping to confirm a successful connection
    await mClient.db("alice").command({ ping: 1 });
    console.log(
      `${textColor.fgGreen}✅ Pinged your deployment. You successfully connected to MongoDB!`
    );
    await mClient.close();
    return true;
  } catch (e) {
    console.error(`${textColor.fgRed}❌ [mongo.ts line 19] Error connecting to MongoDB. Check your connection string or check to see if MongoDB is running.${textColor.reset}`)
    return false;
  }
}

/**
 * Create a MongoDB collection
 * @param mClient - The MongoClient to use
 * @param client - The readied Discord client
 */
export async function createMongoCollection(mClient, client: Client) {
  //Create a collection if it doesn't exists and add the bot to it
  try {
    // Connect the client to the server (optional starting in v4.7)
    await mClient.connect();
    // Send a ping to confirm a successful connection
    await mClient.db("alice").createCollection("users", mongoSchema);
    await mClient
      .db("alice")
      .collection("users")
      .insertOne({
        lastUpdated: new Date(),
        username: client.user.username,
        userID: parseInt(client.user.id),
        created: client.user.createdAt,
      });
    console.log(
      `${textColor.fgGreen}✅ Created a collection and added the bot to it.${textColor.reset}`
    );
  } catch (e) {
    console.warn(
      `${textColor.fgYellow}⚠️  Collection already exists. Moving on.${textColor.reset}`
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await mClient.close();
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
