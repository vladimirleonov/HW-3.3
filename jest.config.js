/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testRegex: "__tests__/e2e/features/(blogs|posts|users)/.*\\.e2e\\.test\\.ts$",
};
