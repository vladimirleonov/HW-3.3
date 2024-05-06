import { MongoClient, ServerApiVersion, Collection } from 'mongodb';
import {SETTINGS} from "../settings";
import {BlogDBType} from "./db-types/blog-db-types";
import {PostDbType} from "./db-types/posts-db-types";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(SETTINGS.MONGO_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export const db = client.db(SETTINGS.DB_NAME);

export const blogCollection: Collection<BlogDBType> = db.collection(SETTINGS.BLOG_COLLECTION_NAME);
export const postCollection: Collection<PostDbType> = db.collection(SETTINGS.POSTS_COLLECTION_NAME);

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

run().catch(console.dir);