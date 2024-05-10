import {req} from "../../test-helpers/req";
import {SETTINGS} from "../../../src/settings";
import {HTTP_CODES} from "../../../src/settings";
import { clearTestDB, closeTestDB, connectToTestDB } from "../../test-helpers/test-db";
import {generateBlogsDataset} from '../../datasets/blogsDatasets'
import { blogCollection } from "../../../src/db/mongo-db";
import { ObjectId } from "mongodb";

describe('GET /blogs', () => {
    beforeAll(async () => {
        await connectToTestDB()
        //await req.delete('/testing/all-data').expect(HTTP_CODES.NO_CONTENT)
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        //setDB()
        await clearTestDB()
    })
    it('+ GET blogs empty array', async () => {
        const res = await req.get(SETTINGS.PATH.BLOGS).expect(HTTP_CODES.OK)

        expect(res.body.length).toBe(0)
    })
    it('+ GET blogs not empty array', async () => {
        const blogsDataset = generateBlogsDataset()
        await blogCollection.insertMany(blogsDataset.blogs)

        const res = await req.get(SETTINGS.PATH.BLOGS).expect(HTTP_CODES.OK)

        expect(res.body.length).toBe(2)
        // expect(res.body[0].id).toEqual(blogsDataset.blogs[0]._id.toString())
        // expect(res.body[1].id).toEqual(blogsDataset.blogs[1]._id.toString())
        expect(res.body[0].id).toBe(blogsDataset.blogs[0]._id.toString())
        expect(res.body[1].id).toBe(blogsDataset.blogs[1]._id.toString())
    })
    it('+ GET blog with correct id', async () => {
        const blogsDataset = generateBlogsDataset()
        await blogCollection.insertMany(blogsDataset.blogs)

        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0]._id.toString()}`)
            .expect(HTTP_CODES.OK)
        
        console.log(res)

        expect(res.body.id).toEqual(blogsDataset.blogs[0]._id.toString())
    })
    it('- GET blog with incorrect id', async () => {
        const blogsDataset = generateBlogsDataset()
        await blogCollection.insertMany(blogsDataset.blogs)

        await req
            .get(`${SETTINGS.PATH.BLOGS}/${new ObjectId()}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
})