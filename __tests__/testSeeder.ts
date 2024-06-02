export const testSeeder = {
    createUserDTO() {
        return {
            login: 'test',
            email: 'test@gmail.com',
            password: 'test1234',
        }
    },
    createUserDTOs(count: number) {
        const users: any = []

        for (let i = 0; i <= count; i++) {
            users.push({
                login: 'test' + i,
                email: `test${i}@gmail.com`,
                password: 'test'
            })
        }

        return users
    },
    createBlogDTO() {
        return {
            name: 'name1',
            description: 'description1',
            websiteUrl: 'https://youtube.com'
        }
    },
    createPostDTO(blogId: string) {
        return {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId
        }
    },
    createCommentDTO() {
        return {
            content: 'contentcontentcontentcontent',
        }
    },
}