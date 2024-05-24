import {req} from "../../../test-helpers/req"
import {SETTINGS} from "../../../../src/settings"
import {clearTestDB, connectToTestDB, closeTestDB} from "../../../test-helpers/test-db"
import {createBlogs} from "../../../test-helpers/dataset-helpers/blogsDatasets"
import {createPosts} from "../../../test-helpers/dataset-helpers/postsDatasets"
import {postCollection, blogCollection} from "../../../../src/db/mongo-db"
import {ObjectId} from "mongodb"
import {OutputPostType} from "../../../../src/features/posts/input-output-types/post-types";
import {PostDbType} from "../../../../src/db/db-types/post-db-types";

describe('GET /users', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    //posts
    it('+ GET posts empty array', async () => {
        const res = await req.get(SETTINGS.PATH.USERS).expect(200)

        expect(res.body.items.length).toBe(0)
    })
    // it('+ GET posts with default query parameters', async () => {
    //     const {blogs} = createBlogs()
    //     await blogCollection.insertMany(blogs)
    //
    //     const postsDataset = createPosts(blogs)
    //     await postCollection.insertMany(postsDataset.posts)
    //
    //     const res = await req.get(SETTINGS.PATH.POSTS).expect(200)
    //
    //     expect(res.body).toHaveProperty('pagesCount');
    //     expect(res.body).toHaveProperty('page');
    //     expect(res.body).toHaveProperty('pageSize');
    //     expect(res.body).toHaveProperty('totalCount');
    //     expect(res.body).toHaveProperty('items');
    //
    //     expect(res.body.pagesCount).toBe(1);
    //     expect(res.body.page).toBe(1);
    //     expect(res.body.pageSize).toBe(10);
    //     expect(res.body.totalCount).toBe(postsDataset.posts.length);
    //
    //     expect(res.body.items.length).toBe(postsDataset.posts.length)
    //     res.body.items.forEach((item: OutputPostType, index: number) => {
    //         res.body.items.forEach((item: OutputPostType, index: number) => {
    //             expect(item.id).toBe(postsDataset.posts[index]._id.toString());
    //             expect(item.title).toBe(postsDataset.posts[index].title);
    //             expect(item.shortDescription).toBe(postsDataset.posts[index].shortDescription);
    //             expect(item.content).toBe(postsDataset.posts[index].content);
    //             expect(item.blogId).toBe(postsDataset.posts[index].blogId.toString());
    //             expect(item.blogName).toBe(postsDataset.posts[index].blogName);
    //             expect(new Date(item.createdAt).toISOString()).toEqual(postsDataset.posts[index].createdAt);
    //         })
    //     })
    // })
    // it('+ GET posts with sorting query parameters', async () => {
    //     const {blogs} = createBlogs()
    //     await blogCollection.insertMany(blogs)
    //
    //     const postsDataset = createPosts(blogs)
    //     await postCollection.insertMany(postsDataset.posts)
    //
    //     const sortBy: string = 'title'
    //     const sortDirection = 'asc'
    //
    //     const res = await req.get(SETTINGS.PATH.POSTS)
    //         .query({sortBy, sortDirection})
    //         .expect(200)
    //
    //     const sortedPosts = postsDataset.posts.sort((a: PostDbType, b: PostDbType) => a.title.localeCompare(b.title))
    //
    //     expect(res.body.items.length).toBe(sortedPosts.length)
    //     res.body.items.forEach((item: OutputPostType, index: number) => {
    //         expect(item.id).toBe(sortedPosts[index]._id.toString());
    //         expect(item.title).toBe(sortedPosts[index].title);
    //         expect(item.shortDescription).toBe(sortedPosts[index].shortDescription);
    //         expect(item.content).toBe(sortedPosts[index].content);
    //         expect(item.blogId).toBe(sortedPosts[index].blogId.toString());
    //         expect(item.blogName).toBe(sortedPosts[index].blogName);
    //         expect(new Date(item.createdAt).toISOString()).toEqual(sortedPosts[index].createdAt);
    //     })
    // })
    // it('+ GET posts with pagination', async () => {
    //     const {blogs} = createBlogs(2)
    //     await blogCollection.insertMany(blogs)
    //
    //     const postsDataset = createPosts(blogs, 5)
    //     await postCollection.insertMany(postsDataset.posts)
    //
    //     const pageNumber: number = 2
    //     const pageSize: number = 3
    //
    //     const res = await req.get(SETTINGS.PATH.POSTS)
    //         .query({pageNumber, pageSize})
    //         .expect(200)
    //
    //     //default sorting by createdAt desc
    //     const sortedPosts: PostDbType[] = postsDataset.posts.sort((a: PostDbType, b: PostDbType) => b.createdAt.localeCompare(a.createdAt));
    //
    //     const paginatedPosts: PostDbType[] = sortedPosts.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
    //
    //     expect(res.body.items.length).toBe(paginatedPosts.length)
    //     res.body.items.forEach((item: OutputPostType, index: number) => {
    //         expect(item.id).toBe(paginatedPosts[index]._id.toString());
    //         expect(item.title).toBe(paginatedPosts[index].title);
    //         expect(item.shortDescription).toBe(paginatedPosts[index].shortDescription);
    //         expect(item.content).toBe(paginatedPosts[index].content);
    //         expect(item.blogId).toBe(paginatedPosts[index].blogId.toString());
    //         expect(item.blogName).toBe(paginatedPosts[index].blogName);
    //         expect(new Date(item.createdAt).toISOString()).toEqual(paginatedPosts[index].createdAt);
    //     })
    // })
    // //posts/{id}
    // it('+ GET post with correct id', async () => {
    //     const {blogs} = createBlogs(2)
    //     await blogCollection.insertMany(blogs)
    //
    //     const postsDataset = createPosts(blogs, 2)
    //     await postCollection.insertMany(postsDataset.posts)
    //
    //     const res = await req
    //         .get(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
    //         .expect(200)
    //
    //     expect(res.body.id).toEqual(postsDataset.posts[0]._id.toString())
    // })
    // it('- GET post with incorrect id', async () => {
    //     const {blogs} = createBlogs(2)
    //     await blogCollection.insertMany(blogs)
    //
    //     const postsDataset = createPosts(blogs, 2)
    //     await postCollection.insertMany(postsDataset.posts)
    //
    //     await req
    //         .get(`${SETTINGS.PATH.POSTS}/${new ObjectId()}`)
    //         .expect(404)
    // })
})