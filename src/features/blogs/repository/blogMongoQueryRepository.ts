import {blogCollection} from "../../../db/mongo-db"
import {BlogDBType} from "../../../db/db-types/blog-db-types"
import {OutputBlogPaginationType, OutputBlogType} from "../../../input-output-types/blog-types"
import {ObjectId} from "mongodb"
import {SanitizedQueryParamsType} from "../../../helpers/queryParamsSanitizer";

export const blogMongoQueryRepository = {
    async findAllForOutput(query: SanitizedQueryParamsType): Promise<OutputBlogPaginationType> {
        try {
            const searchFilter = query.searchNameTerm
                ? { name : { $regex: query.searchNameTerm, $options: 'i' }}
                : {}

            const filter = {
                ...searchFilter
            }

            const blogs: BlogDBType[] = await blogCollection
                .find(filter)
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray()

            const totalCount: number = await blogCollection.countDocuments(filter)

            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount,
                items: blogs.map((blog: BlogDBType) => this.mapToOutput(blog))
            }
        } catch (err) {
            throw new Error("Failed to get blogs")
        }
    },
    async findById(id: ObjectId): Promise<BlogDBType | null> {
        try {
            return await blogCollection.findOne({_id: id})
        } catch (err) {
            throw new Error('Failed to get blog')
        }
    },
    // async findAllForOutput(query: SanitizedQueryParamsType): Promise<OutputBlogType[]> {
    //     const blogs: BlogDBType[] = await this.find(query)
    //     return blogs.map((blog: BlogDBType): OutputBlogType => this.mapToOutput(blog))
    // },
    async findForOutputById(id: ObjectId): Promise<{ blog?: OutputBlogType, error?: string }> {
        const blog: BlogDBType | null = await this.findById(id)
        if (!blog) {
            return {error: 'Blog not found'}
        }
        return {blog: this.mapToOutput(blog)}
    },
    mapToOutput({_id, ...rest}: BlogDBType): OutputBlogType {
        return {
            ...rest,
            id: _id.toString()
        }
    }
}
