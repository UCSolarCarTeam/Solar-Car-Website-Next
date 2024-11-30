/** @type {import("prettier").Config} */
const config = {
  endOfLine: "auto",
  arrowParens: "always",
  printWidth: 80,
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "all",
  tabWidth: 2,
  plugins: [
    require.resolve("@trivago/prettier-plugin-sort-imports"),
  ],
  importOrder: [
    "^@(.*)$",
    "^@/(?!components)(.*)$",
    "^@/components(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

module.exports = config;
