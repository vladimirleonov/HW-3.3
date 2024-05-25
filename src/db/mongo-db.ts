import {Db, MongoClient, ServerApiVersion} from 'mongodb'
import {SETTINGS} from "../settings"
import {BlogDBType} from "./db-types/blog-db-types"
import {PostDbType} from "./db-types/post-db-types";
import {UserDbType} from "./db-types/user-db-types";

export const db = {
    client: {} as MongoClient,
    getDBName(): Db {
        return this.client.db(SETTINGS.DB_NAME)
    },
    async run(url: string) {
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
            return true
        } catch (err: unknown) {
            console.log("Can't connect to mongo server", err)

            //await this.client.close()
            await this.stop()
            return false
        }
    },
    async stop() {
        await this.client.close();
        console.log("Connection successfully closed")
    },
    async drop() {
        // await this.getDBName().dropDatabase() - I'm admin to do it (to use in mongo atlas)
        try {
            const collections = await this.getDBName().listCollections().toArray()

            for (const collection of collections) {
                const collectionName = collection.name;
                await this.getDBName().collection(collectionName).deleteMany({})            }
        } catch (err) {
            console.error('Error in drop db', err)
            await this.stop()
        }
    },
    getCollections(){
        return {
            blogCollection: this.getDBName().collection<BlogDBType>(SETTINGS.BLOG_COLLECTION_NAME as string),
            postCollection: this.getDBName().collection<PostDbType>(SETTINGS.POST_COLLECTION_NAME as string),
            userCollection: this.getDBName().collection<UserDbType>(SETTINGS.USER_COLLECTION_NAME as string)
        }
    }
}

// export let client: MongoClient = {} as MongoClient
//export let db: Db = {} as Db

// export let blogCollection: Collection<BlogDBType> = {} as Collection<BlogDBType>
// export let postCollection: Collection<PostDbType> = {} as Collection<PostDbType>
// export let userCollection: Collection<UserDbType> = {} as Collection<UserDbType>

// export const connectToDB = async (MONGO_URL: string) => {
    //try {
        // client = new MongoClient(MONGO_URL, {
        //     serverApi: {
        //         version: ServerApiVersion.v1,
        //         strict: true,
        //         deprecationErrors: true,
        //     }
        // })

        // db = client.db(SETTINGS.DB_NAME)
        //
        // blogCollection = db.collection(SETTINGS.BLOG_COLLECTION_NAME as string)
        // postCollection = db.collection(SETTINGS.POST_COLLECTION_NAME as string)
        // userCollection = db.collection(SETTINGS.USER_COLLECTION_NAME as string)

        //await client.connect()
        // Send a ping to confirm a successful connection
        //await client.db("admin").command({ping: 1})
        //console.log("Pinged your deployment. You successfully connected to MongoDB!")

    //     return true
    // } catch (err) {
    //     console.log(err)
    //     await client.close()
    //     return false
    // }
// }


//old

// import {PostDbType} from "./db-types/post-db-types"
// import {UserDbType} from "./db-types/user-db-types";
//
// export let client: MongoClient = {} as MongoClient
// export let db: Db = {} as Db
//
// export let blogCollection: Collection<BlogDBType> = {} as Collection<BlogDBType>
// export let postCollection: Collection<PostDbType> = {} as Collection<PostDbType>
// export let userCollection: Collection<UserDbType> = {} as Collection<UserDbType>
//
// export const connectToDB = async (MONGO_URL: string) => {
//     try {
//         client = new MongoClient(MONGO_URL, {
//             serverApi: {
//                 version: ServerApiVersion.v1,
//                 strict: true,
//                 deprecationErrors: true,
//             }
//         })
//
//         db = client.db(SETTINGS.DB_NAME)
//
//         blogCollection = db.collection(SETTINGS.BLOG_COLLECTION_NAME as string)
//         postCollection = db.collection(SETTINGS.POST_COLLECTION_NAME as string)
//         userCollection = db.collection(SETTINGS.USER_COLLECTION_NAME as string)
//
//         await client.connect()
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ping: 1})
//         console.log("Pinged your deployment. You successfully connected to MongoDB!")
//
//         return true
//     } catch (err) {
//         console.log(err)
//         await client.close()
//         return false
//     }
// }