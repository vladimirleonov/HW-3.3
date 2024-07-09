import {CommentDocument, Like, LikeStatus} from "../../db/db-types/comment-db-types";

export const updateLikeCounts = (comment: CommentDocument, userLike: Like, newStatus: string) => {
    if (userLike.status === LikeStatus.Like) comment.likesCount -= 1;
    if (userLike.status === LikeStatus.Dislike) comment.dislikesCount -= 1;
    if (newStatus === LikeStatus.Like) comment.likesCount += 1;
    if (newStatus === LikeStatus.Dislike) comment.dislikesCount += 1;
};