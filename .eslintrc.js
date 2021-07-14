module.exports = {
    env: {
        es2020: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 11,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "import/default": 0,
        "@typescript-eslint/no-inferrable-types": 0,
        "@typescript-eslint/no-unused-vars": 0,
        "import/no-extraneous-dependencies": ["error"],
        "@typescript-eslint/no-use-before-define": [
            "error",
            { functions: false },
        ],
    },
    ignorePatterns: ["node_modules", "*.js", "*.d.ts"],
};
