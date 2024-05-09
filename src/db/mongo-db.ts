import {Collection, Db, MongoClient, ServerApiVersion} from 'mongodb';
import {SETTINGS} from "../settings";
import {BlogDBType} from "./db-types/blog-db-types";
import {PostDbType} from "./db-types/post-db-types";

let client: MongoClient = {} as MongoClient;
export let db: Db = {} as Db;

export let blogCollection: Collection<BlogDBType> = {} as Collection<BlogDBType>;
export let postCollection: Collection<PostDbType> = {} as Collection<PostDbType>;

export const connectToDB = async (MONGO_URL: string) => {
    try {
        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        client = new MongoClient(MONGO_URL, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        const db: Db = client.db(SETTINGS.DB_NAME);

        blogCollection = db.collection(SETTINGS.BLOG_COLLECTION_NAME as string);
        postCollection = db.collection(SETTINGS.POSTS_COLLECTION_NAME as string);

        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        return true;
    } catch(e) {
        console.log(e)
        await client.close()
        return false
    }
}
