import {req} from "../../test-helpers";
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings";
import {setDB} from "../../../src/db/db";
import {blogsDataset} from "../../datasets/blogsDatasets"
import {encodeToBase64} from "../../../src/helpers/auth-helper";

describe('DELETE /blogs', () => {
    beforeAll(async () => {
        await req.delete('/testing/all-data').expect(HTTP_CODES.NO_CONTENT)
    })
    beforeEach(async () => {
        setDB()
    })
    it('- DELETE blogs unauthorized', async () => {
        setDB(blogsDataset)

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- DELETE blogs with incorrect input id', async () => {
        setDB(blogsDataset)

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/123`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
    it('+ DELETE blogs with correct input data', async () => {
        setDB(blogsDataset)

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NO_CONTENT)
    })
})