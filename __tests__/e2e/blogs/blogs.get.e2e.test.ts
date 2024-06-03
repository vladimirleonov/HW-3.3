import {req} from "../../helpers/req"
import {SETTINGS} from "../../../src/settings"
import {HTTP_CODES} from "../../../src/settings"
import {createBlogs} from '../../helpers/blog-helpers'
import {ObjectId} from "mongodb"
import {BlogOutputType} from "../../../src/features/blogs/input-output-types/blog-types"
import {createPosts} from "../../helpers/post-helpers"
import {PostOutputType} from "../../../src/features/posts/input-output-types/post-types"
import {MongoMemoryServer} from "mongodb-memory-server"
import {db} from "../../../src/db/mongo-db"

describe('GET /blogs', () => {
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
    //blogs
    it('+ GET blogs empty array: STATUS 200', async () => {
        const res = await req.get(SETTINGS.PATH.BLOGS).expect(HTTP_CODES.OK)

        expect(res.body.items.length).toBe(0)
    })
    it('+ GET blogs with default query parameters: STATUS 200', async () => {
        const blogs: BlogOutputType[] = await createBlogs()

        const res = await req.get(SETTINGS.PATH.BLOGS).expect(HTTP_CODES.OK)

        expect(res.body.pagesCount).toBe(1)
        expect(res.body.page).toBe(1)
        expect(res.body.pageSize).toBe(10)
        expect(res.body.totalCount).toBe(blogs.length)

        expect(res.body.items.length).toBe(blogs.length)
        res.body.items.forEach((item: BlogOutputType, index: number) => {
            expect(item.id).toBe(blogs[index].id)
            expect(item.name).toBe(blogs[index].name)
            expect(item.description).toBe(blogs[index].description)
            expect(item.websiteUrl).toBe(blogs[index].websiteUrl)
            expect(new Date(item.createdAt).toISOString()).toEqual(blogs[index].createdAt)
            expect(item.isMembership).toBe(blogs[index].isMembership)
        })
    })
    it('+ GET blogs with searchNameTerm: STATUS 200', async () => {
        const blogs: BlogOutputType[] = await createBlogs()

        const searchTerm = '2'

        const res = await req.get(SETTINGS.PATH.BLOGS)
            .query({searchNameTerm: searchTerm})
            .expect(HTTP_CODES.OK)

        const filteredBlogs = blogs.filter(blog => blog.name.toLowerCase().includes(searchTerm.toLowerCase()))

        expect(res.body.items.length).toBe(filteredBlogs.length)
        res.body.items.forEach((item: BlogOutputType, index: number) => {
            expect(item.id).toBe(filteredBlogs[index].id)
            expect(item.name).toBe(filteredBlogs[index].name)
            expect(item.description).toBe(filteredBlogs[index].description)
            expect(item.websiteUrl).toBe(filteredBlogs[index].websiteUrl)
            expect(new Date(item.createdAt).toISOString()).toEqual(filteredBlogs[index].createdAt)
            expect(item.isMembership).toBe(filteredBlogs[index].isMembership)
        })
    })
    it('+ GET blogs with sorting query parameters: STATUS 200', async () => {
        const blogs: BlogOutputType[] = await createBlogs()

        const res = await req.get(SETTINGS.PATH.BLOGS)
            .query({sortBy: 'name', sortDirection: 'asc'})
            .expect(HTTP_CODES.OK)

        const sortedBlogs: BlogOutputType[] = blogs.sort((a: BlogOutputType, b: BlogOutputType) => a.name.localeCompare(b.name))

        expect(res.body.items.length).toBe(sortedBlogs.length)

        res.body.items.forEach((item: BlogOutputType, index: number) => {
            expect(item.id).toBe(sortedBlogs[index].id)
            expect(item.name).toBe(sortedBlogs[index].name)
            expect(item.description).toBe(sortedBlogs[index].description)
            expect(item.websiteUrl).toBe(sortedBlogs[index].websiteUrl)
            expect(new Date(item.createdAt).toISOString()).toEqual(sortedBlogs[index].createdAt)
            expect(item.isMembership).toBe(sortedBlogs[index].isMembership)
        })
    })
    it('+ GET blogs with pagination: STATUS 200', async () => {
        const blogs: BlogOutputType[] = await createBlogs(7)

        const pageNumber: number = 2
        const pageSize: number = 4

        const res = await req.get(SETTINGS.PATH.BLOGS)
            .query({pageNumber, pageSize})
            .expect(HTTP_CODES.OK)

        const paginatedBlogs: BlogOutputType[] = blogs.slice(Math.ceil((pageNumber - 1) * pageSize), pageNumber * pageSize)

        expect(res.body.items.length).toBe(paginatedBlogs.length)

        res.body.items.forEach((item: BlogOutputType, index: number) => {
            expect(item.id).toBe(paginatedBlogs[index].id)
            expect(item.name).toBe(paginatedBlogs[index].name)
            expect(item.description).toBe(paginatedBlogs[index].description)
            expect(item.websiteUrl).toBe(paginatedBlogs[index].websiteUrl)
            expect(new Date(item.createdAt).toISOString()).toEqual(paginatedBlogs[index].createdAt)
            expect(item.isMembership).toBe(paginatedBlogs[index].isMembership)
        })
    })
    //blogs/{blogId}/posts
    it('+ GET posts for specific blog with default query parameters: STATUS 200', async () => {
        const blogs: BlogOutputType[] = await createBlogs(2)
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
            .expect(HTTP_CODES.OK)

        const blogPosts: PostOutputType[] = posts.filter((post: PostOutputType) => post.blogId.toString() === blogId)

        expect(res.body.pagesCount).toBe(1)
        expect(res.body.page).toBe(1)
        expect(res.body.pageSize).toBe(10)
        expect(res.body.totalCount).toBe(blogPosts.length)

        expect(res.body.items.length).toBe(blogPosts.length)
        res.body.items.forEach((item: PostOutputType, index: number) => {
            expect(item.id).toBe(blogPosts[index].id)
            expect(item.title).toBe(blogPosts[index].title)
            expect(item.shortDescription).toBe(blogPosts[index].shortDescription)
            expect(item.content).toBe(blogPosts[index].content)
            expect(item.blogId).toBe(blogPosts[index].blogId.toString())
            expect(item.blogName).toBe(blogPosts[index].blogName)
            expect(new Date(item.createdAt).toISOString()).toEqual(blogPosts[index].createdAt)
        })
    })
    it('+ GET posts for specific blog with sorting query parameters: STATUS 200', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
            .query({sortBy: 'title', sortDirection: 'asc'})
            .expect(HTTP_CODES.OK)

        const blogPosts: PostOutputType[] = posts.filter((post: PostOutputType) => post.blogId.toString() === blogId)

        expect(res.body.items.length).toBe(blogPosts.length)
        res.body.items.forEach((item: PostOutputType, index: number) => {
            expect(item.id).toBe(blogPosts[index].id)
            expect(item.title).toBe(blogPosts[index].title)
            expect(item.shortDescription).toBe(blogPosts[index].shortDescription)
            expect(item.content).toBe(blogPosts[index].content)
            expect(item.blogId).toBe(blogPosts[index].blogId.toString())
            expect(item.blogName).toBe(blogPosts[index].blogName)
            expect(new Date(item.createdAt).toISOString()).toEqual(blogPosts[index].createdAt)
        })
    })
    it('+ GET posts for specific blog with pagination: STATUS 200', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id

        const pageNumber: number = 2
        const pageSize: number = 4

        const res = await req.get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
            .query({pageNumber, pageSize})
            .expect(HTTP_CODES.OK)

        const blogPosts: PostOutputType[] = posts.filter((post: PostOutputType) => post.blogId.toString() === blogId)

        const paginatedBlogPosts: PostOutputType[] = blogPosts.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)

        expect(res.body.items.length).toBe(paginatedBlogPosts.length)
        res.body.items.forEach((item: PostOutputType, index: number) => {
            expect(item.id).toBe(paginatedBlogPosts[index].id)
            expect(item.title).toBe(paginatedBlogPosts[index].title)
            expect(item.shortDescription).toBe(paginatedBlogPosts[index].shortDescription)
            expect(item.content).toBe(paginatedBlogPosts[index].content)
            expect(item.blogId).toBe(paginatedBlogPosts[index].blogId.toString())
            expect(item.blogName).toBe(paginatedBlogPosts[index].blogName)
            expect(new Date(item.createdAt).toISOString()).toEqual(paginatedBlogPosts[index].createdAt)
        })
    })
    //blogs/{id}
    it('+ GET blog with correct id: STATUS 200', async () => {
        const blogs: BlogOutputType[] = await createBlogs()

        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .expect(HTTP_CODES.OK)

        expect(res.body.id).toEqual(blogs[0].id)
    })
    it('- GET blog with incorrect id: STATUS 404', async () => {
        await createBlogs()

        await req
            .get(`${SETTINGS.PATH.BLOGS}/${new ObjectId()}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
})