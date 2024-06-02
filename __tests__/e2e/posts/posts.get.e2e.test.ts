import {req} from "../../helpers/req"
import {SETTINGS} from "../../../src/settings"
import {createBlogs} from "../../helpers/blog-helpers"
import {createPosts} from "../../helpers/post-helpers"
import {ObjectId} from "mongodb"
import {PostOutputType} from "../../../src/features/posts/input-output-types/post-types";
import {BlogOutputType} from "../../../src/features/blogs/input-output-types/blog-types";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/mongo-db";

describe('GET /posts', () => {
    beforeAll(async () => {
        const mongoServer: MongoMemoryServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })
    afterAll(async () => {
        await db.stop()
    })
    beforeEach(async () => {
        await db.drop()
    })
    //posts
    it('+ GET posts empty array', async () => {
        const res = await req.get(SETTINGS.PATH.POSTS).expect(200)

        expect(res.body.items.length).toBe(0)
    })
    it('+ GET posts with default query parameters', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const res = await req.get(SETTINGS.PATH.POSTS).expect(200)

        expect(res.body.pagesCount).toBe(1);
        expect(res.body.page).toBe(1);
        expect(res.body.pageSize).toBe(10);
        expect(res.body.totalCount).toBe(posts.length);

        expect(res.body.items.length).toBe(posts.length)
        res.body.items.forEach((item: PostOutputType, index: number) => {
            res.body.items.forEach((item: PostOutputType, index: number) => {
                expect(item.id).toBe(posts[index].id);
                expect(item.title).toBe(posts[index].title);
                expect(item.shortDescription).toBe(posts[index].shortDescription);
                expect(item.content).toBe(posts[index].content);
                expect(item.blogId).toBe(posts[index].blogId.toString());
                expect(item.blogName).toBe(posts[index].blogName);
                expect(new Date(item.createdAt).toISOString()).toEqual(posts[index].createdAt);
            })
        })
    })
    it('+ GET posts with sorting query parameters', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const sortBy: string = 'title'
        const sortDirection = 'asc'

        const res = await req.get(SETTINGS.PATH.POSTS)
            .query({sortBy, sortDirection})
            .expect(200)

        const sortedPosts = posts.sort((a: PostOutputType, b: PostOutputType) => a.title.localeCompare(b.title))

        expect(res.body.items.length).toBe(sortedPosts.length)
        res.body.items.forEach((item: PostOutputType, index: number) => {
            expect(item.id).toBe(sortedPosts[index].id);
            expect(item.title).toBe(sortedPosts[index].title);
            expect(item.shortDescription).toBe(sortedPosts[index].shortDescription);
            expect(item.content).toBe(sortedPosts[index].content);
            expect(item.blogId).toBe(sortedPosts[index].blogId.toString());
            expect(item.blogName).toBe(sortedPosts[index].blogName);
            expect(new Date(item.createdAt).toISOString()).toEqual(sortedPosts[index].createdAt);
        })
    })
    it('+ GET posts with pagination', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const pageNumber: number = 2
        const pageSize: number = 3

        const res = await req.get(SETTINGS.PATH.POSTS)
            .query({pageNumber, pageSize})
            .expect(200)

        const paginatedPosts: PostOutputType[] = posts.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)

        expect(res.body.items.length).toBe(paginatedPosts.length)
        res.body.items.forEach((item: PostOutputType, index: number) => {
            expect(item.id).toBe(paginatedPosts[index].id);
            expect(item.title).toBe(paginatedPosts[index].title);
            expect(item.shortDescription).toBe(paginatedPosts[index].shortDescription);
            expect(item.content).toBe(paginatedPosts[index].content);
            expect(item.blogId).toBe(paginatedPosts[index].blogId.toString());
            expect(item.blogName).toBe(paginatedPosts[index].blogName);
            expect(new Date(item.createdAt).toISOString()).toEqual(paginatedPosts[index].createdAt);
        })
    })
    //posts/{id}
    it('+ GET post with correct id', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const res = await req
            .get(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .expect(200)

        expect(res.body.id).toEqual(posts[0].id)
    })
    it('- GET post with incorrect id', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        await createPosts(blogs)

        await req
            .get(`${SETTINGS.PATH.POSTS}/${new ObjectId()}`)
            .expect(404)
    })
})