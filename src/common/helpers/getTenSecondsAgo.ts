export const getTenSecondsAgo = (): Date => {
    return new Date(new Date().getTime() - 10000);
}