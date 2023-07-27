const { MongoClient, ServerApiVersion } = require("mongodb");
import { Client } from 'discord.js';

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
        await mClient.db("alice").createCollection("users", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["username", "id"],
                    properties: {
                        username: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        id: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        }
                    }
                }
            }
        });
        await mClient.db("alice").collection("users").insertOne({
            username: client.user.username,
            id: client.user.id
        });
        console.log("Created a collection and added the bot to it.");
        }
    catch {
        console.log("Collection already exists.");

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