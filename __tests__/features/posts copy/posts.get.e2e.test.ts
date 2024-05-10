import {req} from "../../test-helpers";
import {SETTINGS} from "../../../src/settings";
import {setDB} from "../../../src/db/db";
import {postsDataset} from "../../datasets/postsDatasets"

describe('GET /posts', () => {
    beforeAll(async () => {
        await req.delete('/testing/all-data').expect(204)
    })
    beforeEach(async () => {
        setDB()
    })
    it('+ GET posts empty array', async () => {
        const res = await req.get(SETTINGS.PATH.POSTS).expect(200)

        expect(res.body.length).toBe(0)
    })
    it('+ GET posts not empty array', async () => {
        setDB(postsDataset)

        const res = await req.get(SETTINGS.PATH.POSTS).expect(200)

        expect(res.body.length).toBe(1)
        expect(res.body).toEqual(postsDataset.posts)
    })
    it('+ GET post with correct id', async () => {
        setDB(postsDataset)

        const res = await req
            .get(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .expect(200)

        expect(res.body).toEqual(postsDataset.posts?.[0])
    })
    it('- GET post with incorrect id', async () => {
        setDB(postsDataset)

        await req
            .get(`${SETTINGS.PATH.POSTS}/-123`)
            .expect(404)
    })
})