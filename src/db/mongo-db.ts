import {Db, MongoClient, ServerApiVersion} from 'mongodb'
import {SETTINGS} from "../settings"
import {BlogDBType} from "./db-types/blog-db-types"
import {PostDbType} from "./db-types/post-db-types";
import {UserDbType} from "./db-types/user-db-types";
import {CommentDbType} from "./db-types/comment-db-types";
import {RevokedTokenDbType} from "./db-types/refreshToken-db-types";
import {UserDeviceDBType} from "./db-types/user-devices-db-types";
import {setupIndexes} from "./setupIndexes";

export const db = {
    client: {} as MongoClient,
    getDBName(): Db {
        return this.client.db(SETTINGS.DB_NAME)
    },
    async run(url: string): Promise<boolean> {
        try {
            this.client = new MongoClient(url, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            })
            await this.client.connect()
            await this.getDBName().command({ping: 1})
            console.log("Connected successfully to mongo server")

            //await this.createCollections()

            // set up indexes
            await setupIndexes()

            return true
        } catch (err: unknown) {
            console.log("Can't connect to mongo server", err)

            //await this.client.close()
            await this.stop()
            return false
        }
    },
    async stop(): Promise<void> {
        await this.client.close();
        console.log("Connection successfully closed")
    },
    async drop(): Promise<void> {
        // await this.getDBName().dropDatabase() - to be admin, to use in mongo atlas
        try {
            const collections = await this.getDBName().listCollections().toArray()

            for (const collection of collections) {
                const collectionName = collection.name;
                await this.getDBName().collection(collectionName).deleteMany({})
            }
        } catch (err) {
            console.error('Error in drop db', err)
            await this.stop()
        }
    },
    async createCollections(): Promise<void> {
        try {
            await this.getDBName().createCollection(SETTINGS.BLOG_COLLECTION_NAME as string);
            await this.getDBName().createCollection(SETTINGS.POST_COLLECTION_NAME as string);
            await this.getDBName().createCollection(SETTINGS.USER_COLLECTION_NAME as string);
            await this.getDBName().createCollection(SETTINGS.COMMENT_COLLECTION_NAME as string);
            await this.getDBName().createCollection(SETTINGS.REVOKED_TOKEN_COLLECTION_NAME as string);
            await this.getDBName().createCollection(SETTINGS.USER_DEVICE_COLLECTION_NAME as string);
            await this.getDBName().createCollection(SETTINGS.API_ACCESS_LOGS_COLLECTION_NAME as string);
        } catch (err) {
            console.error('Error creating collections', err);
            await this.stop();
        }
    },
    getCollections() {
        return {
            blogCollection: this.getDBName().collection<BlogDBType>(SETTINGS.BLOG_COLLECTION_NAME as string),
            postCollection: this.getDBName().collection<PostDbType>(SETTINGS.POST_COLLECTION_NAME as string),
            userCollection: this.getDBName().collection<UserDbType>(SETTINGS.USER_COLLECTION_NAME as string),
            commentCollection: this.getDBName().collection<CommentDbType>(SETTINGS.COMMENT_COLLECTION_NAME as string),
            revokedTokenCollection: this.getDBName().collection<RevokedTokenDbType>(SETTINGS.REVOKED_TOKEN_COLLECTION_NAME as string),
            userDeviceCollection: this.getDBName().collection<UserDeviceDBType>(SETTINGS.USER_DEVICE_COLLECTION_NAME as string),
            apiAccessLogsCollection: this.getDBName().collection<ApiAccessLogDbType>(SETTINGS.API_ACCESS_LOGS_COLLECTION_NAME as string),
        }
    }
}