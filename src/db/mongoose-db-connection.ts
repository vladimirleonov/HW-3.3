import {ApiAccessLogModel} from "./models/apiAccessLog.model";
import {BlogModel} from "./models/blog.model"
import {CommentModel} from "./models/comment.model";
import {PostModel} from "./models/post.model";
import {UserModel} from "./models/user.model";
import {RevokedTokenModel} from "./models/revokedToken.model"
import mongoose from 'mongoose';
import {UserDeviceModel} from "./models/devices.model";

export const db = {
    async run(url: string): Promise<boolean> {
        try {
            await mongoose.connect(url)
            console.log('Connected successfully to MongoDB')

            //await setupIndexes()

            return true
        } catch (err: unknown) {
            console.log("Can't connect to MongoDB server", err)

            await this.stop()
            return false
        }
    },
    async stop(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.log("Connection successfully closed");
        } catch (err) {
            console.error("Error during disconnection", err);
        }
    },
    async drop(): Promise<boolean> {
        try {
            await Promise.all([
                BlogModel.deleteMany({}),
                PostModel.deleteMany({}),
                CommentModel.deleteMany({}),
                UserModel.deleteMany({}),
                ApiAccessLogModel.deleteMany({}),
                RevokedTokenModel.deleteMany({}),
                UserDeviceModel.deleteMany({})
            ]);
            console.log('Cleared all collections in MongoDB');
            return true
        } catch (err) {
            console.error('Error in drop db', err)
            await this.stop()
            return false
        }
    }
}