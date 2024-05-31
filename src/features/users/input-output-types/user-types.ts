import {DefaultQueryParamsInputType} from "../../../common/input-output-types/common-types";

export type UsersQueryParamsInputType = DefaultQueryParamsInputType & {
    searchLoginTerm?: string
    searchEmailTerm?: string
}

export type UserBodyInputType = {
    login: string
    password: string
    email: string
}

// export type BaseUserType = {
//     login: string;
//     email: string;
//     createdAt: string;
// };
//
// export type UserWithIdOutputType = BaseUserType & {
//     id: string;
// };
//
// export type DefaultUserOutputType = BaseUserType;

// export type OutputUserWithoutIdType = {
//     id: string
//     login: string
//     email: string
//     createdAt: string
// }
//
// export type OutputUserWithoutIdType BaseUserType = {
//     login: string
//     email: string
//     createdAt: string
// }

// export type OutputUserType = {
//     id: string
//     login: string
//     email: string
//     createdAt: string
// }

export type BaseUserOutputType = {
    login: string;
    email: string;
};

export type UserWithUserIdOutputType = BaseUserOutputType & {
    userId: string;
};

export type UserWithCreatedAtOutputType = BaseUserOutputType & {
    createdAt: string;
};

export type UserWithIdAndCreatedAtOutputType = BaseUserOutputType & {
    id: string;
    createdAt: string;
};

export type OutputUserPaginationType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserWithIdAndCreatedAtOutputType[]
}