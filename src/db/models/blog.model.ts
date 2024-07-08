import * as mongoose from "mongoose"
import {Blog} from "../db-types/blog-db-types";

const isValidISOString = (value: string) => {
    const isoRegex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    return isoRegex.test(value);
};

const blogSchema = new mongoose.Schema<Blog>(
    {
        name: {
            type: String,
            maxlength: 15,
            required: true
        },
        description: {
            type: String,
            maxlength: 500,
            required: true
        },
        websiteUrl: {
            type: String,
            maxlength: 100,
            required: true,
            match: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
        },
        createdAt: {
            type: String,
            validate: {
                validator: isValidISOString,
                message: "createdAt must be a valid ISO string",
            },
            required: true
        },
        isMembership: {
            type: Boolean,
            default: false
        },
    },
);

export const BlogModel = mongoose.model<Blog>('Blog', blogSchema)