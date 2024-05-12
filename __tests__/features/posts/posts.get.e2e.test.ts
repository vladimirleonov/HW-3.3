import {req} from "../../test-helpers/req"
import {SETTINGS} from "../../../src/settings"
import {clearTestDB, connectToTestDB, closeTestDB} from "../../test-helpers/test-db"
import {generateBlogsDataset} from "../../datasets/blogsDatasets"
import {generatePostsDataset} from "../../datasets/postsDatasets"
import {postCollection, blogCollection} from "../../../src/db/mongo-db"
import {ObjectId} from "mongodb"

describe('GET /posts', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    it('+ GET posts empty array', async () => {
        const res = await req.get(SETTINGS.PATH.POSTS).expect(200)

        expect(res.body.length).toBe(0)
    })
    it('+ GET posts not empty array', async () => {
        const {blogs} = generateBlogsDataset(2)
        await blogCollection.insertMany(blogs)

        const postsDataset = generatePostsDataset(blogs, 2)
        await postCollection.insertMany(postsDataset.posts)


        const res = await req.get(SETTINGS.PATH.POSTS).expect(200)

        expect(res.body.length).toBe(2)
        expect(res.body[0].id).toEqual(postsDataset.posts[0]._id.toString())
        expect(res.body[1].id).toEqual(postsDataset.posts[1]._id.toString())
    })
    it('+ GET post with correct id', async () => {
        const {blogs} = generateBlogsDataset(2)
        await blogCollection.insertMany(blogs)

        const postsDataset = generatePostsDataset(blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const res = await req
            .get(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
            .expect(200)

        expect(res.body.id).toEqual(postsDataset.posts[0]._id.toString())
    })
    it('- GET post with incorrect id', async () => {
        const {blogs} = generateBlogsDataset(2)
        await blogCollection.insertMany(blogs)

        const postsDataset = generatePostsDataset(blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        await req
            .get(`${SETTINGS.PATH.POSTS}/${new ObjectId()}`)
            .expect(404)
    })
})