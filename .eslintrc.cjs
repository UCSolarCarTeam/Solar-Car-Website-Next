/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const prettierConfig = require(path.join(__dirname, ".prettierrc.cjs"));

/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:prettier/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  plugins: [
    "@typescript-eslint",
    "prettier",
    "promise",
    "sort-keys",
    "sort-destructure-keys",
  ],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        fixStyle: "inline-type-imports",
        prefer: "type-imports",
      },
    ],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/require-await": "off",
    eqeqeq: ["error", "smart"],
    "no-console": "error",
    "no-eval": "error",
    "no-var": "error",
    "prettier/prettier": ["error", prettierConfig],
    "react/jsx-sort-props": "error",
    "react/sort-comp": 0,
    "sort-destructure-keys/sort-destructure-keys": 2,
    // "no-restricted-imports": ["error", { patterns: [".*"] }],
    "sort-keys": "error",
    "sort-keys/sort-keys-fix": "error",
  },
};
module.exports = config;
