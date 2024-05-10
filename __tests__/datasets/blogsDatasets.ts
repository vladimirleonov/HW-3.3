import { ObjectId } from "mongodb";
import { BlogDBType } from "../../src/db/db-types/blog-db-types";

export const generateBlogsDataset = (count = 2) => {
    const currentDate = new Date().toISOString();
    const blogs: BlogDBType[] = [];

    for (let i = 1; i <= count; i++) {
        blogs.push({
            _id: new ObjectId(),
            name: `name${i}`,
            description: `description${i}`,
            websiteUrl: `https://websiteUrl${i}.com`,
            createdAt: currentDate,
            isMembership: false
        });
    }

    return { blogs };
};

// export const generateBlogsDataset = () => {
//     const currentDate = new Date().toISOString()
//     const blogId1 = new ObjectId();
//     const blogId2 = new ObjectId();

//     return {
//         blogs: [
//             {
//                 _id: blogId1,
//                 name: 'name1',
//                 description: 'description1',
//                 websiteUrl: 'https://websiteUrl1.com',
//                 createdAt: currentDate,
//                 isMembership: false
//             },
//             {
//                 _id: blogId2,
//                 name: 'name1',
//                 description: 'description1',
//                 websiteUrl: 'https://websiteUrl1.com',
//                 createdAt: currentDate,
//                 isMembership: false
//             },
//         ]
//     }
// }