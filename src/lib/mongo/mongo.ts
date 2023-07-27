const { MongoClient, ServerApiVersion } = require("mongodb");
import { Client } from 'discord.js';
import { mongoSchema } from './schema';

/**
 * ping a MongoDB deployment
 * @param mClient - The MongoClient to use
 */
export async function pingMongoDB(mClient: typeof MongoClient) {
	try {
	  // Connect the client to the server (optional starting in v4.7)
	  await mClient.connect();
	  // Send a ping to confirm a successful connection
	  await mClient.db("alice").command({ ping: 1 });
	  console.log("Pinged your deployment. You successfully connected to MongoDB!");
	} finally {
	  // Ensures that the client will close when you finish/error
	  await mClient.close();
	}
}

/**
 * Create a MongoDB collection
 * @param mClient - The MongoClient to use
 * @param client - The readied Discord client
 */
export async function createMongoCollection(mClient: typeof MongoClient, client: Client) {
    //Create a collection if it doesn't exists and add the bot to it 
    try {
        // Connect the client to the server (optional starting in v4.7)
        await mClient.connect();
        // Send a ping to confirm a successful connection
        await mClient.db("alice").createCollection("users", mongoSchema);
        await mClient.db("alice").collection("users").insertOne({
            lastUpdated: new Date(),
            username: client.user.username,
            userID: parseInt(client.user.id),
            created: client.user.createdAt,
        });
        console.log("Created a collection and added the bot to it.");
        }
    catch (e){
        console.log(e);

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
export async function queryMongoCollection(db: string, collection: string, query: object, mClient: typeof MongoClient) {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await mClient.connect();
        // Send a ping to confirm a successful connection
        const result = await mClient.db(db).collection(collection).findOne(query);
        console.log(result);
        return result;
    } finally {
        // Ensures that the client will close when you finish/error
        await mClient.close();
    }
}

export async function addToMongoCollection(mClient: typeof MongoClient, query: object) {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await mClient.connect();
        // Send a ping to confirm a successful connection
        await mClient.db("alice").collection("users").insertOne(query);
        console.log("Added a user to the collection.");
    } finally {
        // Ensures that the client will close when you finish/error
        await mClient.close();
    }
} 