/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testRegex: "__tests__/e2e/(blogs|posts|users|comments|auth)/.*\\.e2e\\.test\\.ts$",
};
