/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testRegex: "__tests__/features/(blogs|posts)/.*\\.e2e\\.test\\.ts$",
};
