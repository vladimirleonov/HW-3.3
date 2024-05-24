import {MongoMemoryServer} from 'mongodb-memory-server'
import {connectToDB, client, blogCollection, postCollection, userCollection} from '../../src/db/mongo-db'

let mongoServer: MongoMemoryServer

export const connectToTestDB = async () => {
    try {
        // This will create an new instance of "MongoMemoryServer" and start it
        mongoServer = await MongoMemoryServer.create()
        const uri: string = mongoServer.getUri()
        await connectToDB(uri)
        console.log("Connected to In-Memory MongoDB for Testing")
        return true
    } catch (err) {
        console.error("Failed to connect to In-Memory MongoDB:", err)
        await client.close()
        return false
    }
}

export const closeTestDB = async () => {
    await client.close()
    await mongoServer.stop()
    console.log("In-Memory MongoDB closed")
}

export const clearTestDB = async () => {
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})
    await userCollection.deleteMany({})
    console.log("In-Memory MongoDB cleared")
}