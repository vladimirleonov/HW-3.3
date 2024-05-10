import {req} from "../../test-helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings"
import {setDB} from "../../../src/db/db"
import {encodeToBase64} from "../../../src/helpers/auth-helper";

describe('DELETE /posts', () => {
    beforeAll(async () => {
        await req.delete('/testing/all-data').expect(204)
    })
    beforeEach(async () => {
        setDB()
    })
    it('- DELETE posts unauthorized', async () => {
        

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- DELETE posts with incorrect input id', async () => {
        

        await req
            .delete(`${SETTINGS.PATH.POSTS}/-123`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
    it('+ DELETE posts with correct input data', async () => {
        

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NO_CONTENT)
    })
})