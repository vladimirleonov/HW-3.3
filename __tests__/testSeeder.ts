import {UserDbType, UserDocument, UserModel} from "../src/db/models/user.model";
import {InsertOneResult, ObjectId, WithId} from "mongodb";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";
import {db} from "../src/db/mongoose-db-connection";
import {cryptoAdapter} from "../src/common/adapters/crypto.adapter"
import {UserDeviceDBType, UserDeviceModel} from "../src/db/models/devices.model";

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
    async registerUser(
        login: string,
        email: string,
        password: string,
        code?: string,
        expirationDate?: string,
        isConfirmed?: boolean,
    )
    // : Promise<IUserService>
    {
        const saltRounds: number = 10
        const passwordHash: string = await cryptoAdapter.createHash(password, saltRounds)

        const newUser: UserDocument = new UserModel({
            //_id: new ObjectId(),
            login,
            email,
            password: passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: code ?? randomUUID(),
                expirationDate: expirationDate ?? add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }).toISOString(),
                isConfirmed: isConfirmed ?? false
            }
        });

        const res: UserDocument = await newUser.save();
        //const res: InsertOneResult<UserDbType> = await db.getCollections().userCollection.insertOne({...newUser})

        const { _id, ...userWithoutId } = newUser;

        return {
            id: res._id.toString(),
            ...userWithoutId
        }
    },
    async getDevices(): Promise<WithId<UserDeviceDBType>[]> {
        return UserDeviceModel.find({}).lean().exec()
    }
}