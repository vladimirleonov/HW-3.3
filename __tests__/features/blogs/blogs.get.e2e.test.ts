import {req} from "../../test-helpers/req"
import {SETTINGS} from "../../../src/settings"
import {HTTP_CODES} from "../../../src/settings"
import {clearTestDB, closeTestDB, connectToTestDB} from "../../test-helpers/test-db"
import {generateBlogsDataset} from '../../datasets/blogsDatasets'
import {blogCollection, postCollection} from "../../../src/db/mongo-db"
import {ObjectId} from "mongodb"
import {BlogDBType} from "../../../src/db/db-types/blog-db-types";
import {OutputBlogType} from "../../../src/features/blogs/types/blog-types";
import {generatePostsDataset} from "../../datasets/postsDatasets";
import {PostDbType} from "../../../src/db/db-types/post-db-types";
import {OutputPostType} from "../../../src/features/posts/types/post-types";

describe('GET /blogs', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    //blogs
    it('+ GET blogs empty array', async () => {
        const res = await req.get(SETTINGS.PATH.BLOGS).expect(HTTP_CODES.OK)

        expect(res.body.items.length).toBe(0)
    })
    // it('+ GET blogs not empty array', async () => {
    //     const blogsDataset = generateBlogsDataset()
    //     await blogCollection.insertMany(blogsDataset.blogs)
    //
    //     const res = await req.get(SETTINGS.PATH.BLOGS).expect(HTTP_CODES.OK)
    //
    //     expect(res.body.items.length).toBe(2)
    //     res.body.items.forEach((item: OutputBlogType, index: number) => {
    //         expect(item.id).toBe(blogsDataset.blogs[index]._id.toString());
    //         expect(item.name).toBe(blogsDataset.blogs[index].name);
    //         expect(item.description).toBe(blogsDataset.blogs[index].description);
    //         expect(item.websiteUrl).toBe(blogsDataset.blogs[index].websiteUrl);
    //         expect(new Date(item.createdAt).toISOString()).toEqual(blogsDataset.blogs[index].createdAt);
    //         expect(item.isMembership).toBe(blogsDataset.blogs[index].isMembership);
    //     });
    // })
    it('+ GET blogs with default query parameters', async () => {
        const blogsDataset = generateBlogsDataset()
        await blogCollection.insertMany(blogsDataset.blogs)

        const res = await req.get(SETTINGS.PATH.BLOGS).expect(HTTP_CODES.OK)

        //default sorting by createdAt desc
        const sortedBlogs: BlogDBType[] = blogsDataset.blogs.sort((a: BlogDBType, b: BlogDBType) => b.createdAt.localeCompare(a.createdAt));

        expect(res.body).toHaveProperty('pagesCount');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('pageSize');
        expect(res.body).toHaveProperty('totalCount');
        expect(res.body).toHaveProperty('items');

        expect(res.body.pagesCount).toBe(1);
        expect(res.body.page).toBe(1);
        expect(res.body.pageSize).toBe(10);
        expect(res.body.totalCount).toBe(blogsDataset.blogs.length);

        expect(res.body.items.length).toBe(sortedBlogs.length);
        res.body.items.forEach((item: OutputBlogType, index: number) => {
            expect(item.id).toBe(sortedBlogs[index]._id.toString());
            expect(item.name).toBe(sortedBlogs[index].name);
            expect(item.description).toBe(sortedBlogs[index].description);
            expect(item.websiteUrl).toBe(sortedBlogs[index].websiteUrl);
            expect(new Date(item.createdAt).toISOString()).toEqual(sortedBlogs[index].createdAt);
            expect(item.isMembership).toBe(sortedBlogs[index].isMembership);
        });
    })
    it('+ GET blogs with searchNameTerm', async () => {
        const blogsDataset = generateBlogsDataset(12)
        await blogCollection.insertMany(blogsDataset.blogs)

        const searchTerm = '2';

        const res = await req.get(SETTINGS.PATH.BLOGS)
            .query({searchNameTerm: searchTerm})
            .expect(HTTP_CODES.OK)

        //default sorting by createdAt desc
        const sortedBlogs: BlogDBType[] = blogsDataset.blogs.sort((a: BlogDBType, b: BlogDBType) => b.createdAt.localeCompare(a.createdAt));

        const filteredBlogs = sortedBlogs.filter(blog => blog.name.toLowerCase().includes(searchTerm.toLowerCase()))

        expect(res.body.items.length).toBe(filteredBlogs.length);
        res.body.items.forEach((item: OutputBlogType, index: number) => {
            expect(item.id).toBe(filteredBlogs[index]._id.toString());
            expect(item.name).toBe(filteredBlogs[index].name);
            expect(item.description).toBe(filteredBlogs[index].description);
            expect(item.websiteUrl).toBe(filteredBlogs[index].websiteUrl);
            expect(new Date(item.createdAt).toISOString()).toEqual(filteredBlogs[index].createdAt);
            expect(item.isMembership).toBe(filteredBlogs[index].isMembership);
        });
    })
    it('+ GET blogs with sorting query parameters', async () => {
        const blogsDataset = generateBlogsDataset(3)
        await blogCollection.insertMany(blogsDataset.blogs)

        const res = await req.get(SETTINGS.PATH.BLOGS)
            .query({sortBy: 'name', sortDirection: 'asc'})
            .expect(HTTP_CODES.OK)

        const sortedBlogs = blogsDataset.blogs.sort((a: BlogDBType, b: BlogDBType) => a.name.localeCompare(b.name))

        expect(res.body.items.length).toBe(sortedBlogs.length);

        res.body.items.forEach((item: OutputBlogType, index: number) => {
            expect(item.id).toBe(sortedBlogs[index]._id.toString());
            expect(item.name).toBe(sortedBlogs[index].name);
            expect(item.description).toBe(sortedBlogs[index].description);
            expect(item.websiteUrl).toBe(sortedBlogs[index].websiteUrl);
            expect(new Date(item.createdAt).toISOString()).toEqual(sortedBlogs[index].createdAt);
            expect(item.isMembership).toBe(sortedBlogs[index].isMembership);
        })
    })
    it('+ GET blogs with pagination', async () => {
        const blogsDataset = generateBlogsDataset(7)
        await blogCollection.insertMany(blogsDataset.blogs)

        const pageNumber: number = 2;
        const pageSize: number = 4;

        const res = await req.get(SETTINGS.PATH.BLOGS)
            .query({pageNumber, pageSize})
            .expect(HTTP_CODES.OK)

        //default sorting by createdAt desc
        const sortedBlogs: BlogDBType[] = blogsDataset.blogs.sort((a: BlogDBType, b: BlogDBType) => b.createdAt.localeCompare(a.createdAt));

        const paginatedBlogs: BlogDBType[] = sortedBlogs.slice(Math.ceil((pageNumber - 1) * pageSize), pageNumber * pageSize);

        expect(res.body.items.length).toBe(paginatedBlogs.length);

        res.body.items.forEach((item: OutputBlogType, index: number) => {
            expect(item.id).toBe(paginatedBlogs[index]._id.toString());
            expect(item.name).toBe(paginatedBlogs[index].name);
            expect(item.description).toBe(paginatedBlogs[index].description);
            expect(item.websiteUrl).toBe(paginatedBlogs[index].websiteUrl);
            expect(new Date(item.createdAt).toISOString()).toEqual(paginatedBlogs[index].createdAt);
            expect(item.isMembership).toBe(paginatedBlogs[index].isMembership);
        })
    })
    //blogs/{blogId}/posts
    it('+ GET posts for specific blog with default query parameters', async () => {
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 11)
        await postCollection.insertMany(postsDataset.posts)

        const blogId: string= blogsDataset.blogs[0]._id.toString()

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
            .expect(HTTP_CODES.OK)

        //default sorting by createdAt desc
        const sortedPosts: PostDbType[] = postsDataset.posts.sort((a: PostDbType, b: PostDbType) => b.createdAt.localeCompare(a.createdAt));

        const blogPosts: PostDbType[] = sortedPosts.filter((post: PostDbType) => post.blogId.toString() === blogId)


        expect(res.body).toHaveProperty('pagesCount');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('pageSize');
        expect(res.body).toHaveProperty('totalCount');
        expect(res.body).toHaveProperty('items');

        expect(res.body.pagesCount).toBe(1);
        expect(res.body.page).toBe(1);
        expect(res.body.pageSize).toBe(10);
        expect(res.body.totalCount).toBe(blogPosts.length);

        expect(res.body.items.length).toBe(blogPosts.length);
        res.body.items.forEach((item: OutputPostType, index: number) => {
            expect(item.id).toBe(blogPosts[index]._id.toString());
            expect(item.title).toBe(blogPosts[index].title);
            expect(item.shortDescription).toBe(blogPosts[index].shortDescription);
            expect(item.content).toBe(blogPosts[index].content);
            expect(item.blogId).toBe(blogPosts[index].blogId.toString());
            expect(item.blogName).toBe(blogPosts[index].blogName);
            expect(new Date(item.createdAt).toISOString()).toEqual(blogPosts[index].createdAt);
        })
    })
    it('+ GET posts for specific blog with sorting query parameters', async () => {
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 11)
        await postCollection.insertMany(postsDataset.posts)

        const blogId: string= blogsDataset.blogs[0]._id.toString()

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
            .query({sortBy: 'title', sortDirection: 'asc'})
            .expect(HTTP_CODES.OK)

        const blogPosts: PostDbType[] = postsDataset.posts.filter((post: PostDbType) => post.blogId.toString() === blogId)

        const sortedBlogPosts: PostDbType[] = blogPosts.sort((a: PostDbType, b: PostDbType) => a.title.localeCompare(b.title));

        expect(res.body.items.length).toBe(sortedBlogPosts.length);
        res.body.items.forEach((item: OutputPostType, index: number) => {
            expect(item.id).toBe(sortedBlogPosts[index]._id.toString());
            expect(item.title).toBe(sortedBlogPosts[index].title);
            expect(item.shortDescription).toBe(sortedBlogPosts[index].shortDescription);
            expect(item.content).toBe(sortedBlogPosts[index].content);
            expect(item.blogId).toBe(sortedBlogPosts[index].blogId.toString());
            expect(item.blogName).toBe(sortedBlogPosts[index].blogName);
            expect(new Date(item.createdAt).toISOString()).toEqual(sortedBlogPosts[index].createdAt);
        })
    })
    it('+ GET posts for specific blog with pagination', async () => {
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 13)
        await postCollection.insertMany(postsDataset.posts)

        const blogId: string= blogsDataset.blogs[0]._id.toString()

        const pageNumber: number = 2
        const pageSize: number = 4

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
            .query({pageNumber, pageSize})
            .expect(HTTP_CODES.OK)

        const blogPosts: PostDbType[] = postsDataset.posts.filter((post: PostDbType) => post.blogId.toString() === blogId)

        //default sorting by createdAt desc
        const sortedPosts: PostDbType[] = blogPosts.sort((a: PostDbType, b: PostDbType) => b.createdAt.localeCompare(a.createdAt));

        const paginatedBlogPosts: PostDbType[] = sortedPosts.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)

        expect(res.body.items.length).toBe(paginatedBlogPosts.length);
        res.body.items.forEach((item: OutputPostType, index: number) => {
            expect(item.id).toBe(paginatedBlogPosts[index]._id.toString());
            expect(item.title).toBe(paginatedBlogPosts[index].title);
            expect(item.shortDescription).toBe(paginatedBlogPosts[index].shortDescription);
            expect(item.content).toBe(paginatedBlogPosts[index].content);
            expect(item.blogId).toBe(paginatedBlogPosts[index].blogId.toString());
            expect(item.blogName).toBe(paginatedBlogPosts[index].blogName);
            expect(new Date(item.createdAt).toISOString()).toEqual(paginatedBlogPosts[index].createdAt);
        })
    })
    //blogs/{id}
    it('+ GET blog with correct id', async () => {
        const blogsDataset = generateBlogsDataset()
        await blogCollection.insertMany(blogsDataset.blogs)

        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0]._id.toString()}`)
            .expect(HTTP_CODES.OK)

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