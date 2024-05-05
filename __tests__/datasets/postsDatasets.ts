import {generateUniqueId} from "../../src/helpers/id-helper";
import {PostDbType} from "../../src/db/db-types/posts-db-types";
import {DBType} from "../../src/db/db";

export const post1: PostDbType = {
    id: generateUniqueId(),
    title: 'title1',
    shortDescription: 'shortDescription1',
    content: 'content1',
    blogId: 'blogId1',
    blogName: 'name1',
}

export const postsDataset: Required<Partial<DBType>> = {
    posts: [post1]
} as Required<Partial<DBType>>