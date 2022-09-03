module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parser: "@typescript-eslint/parser",
  // @typescript-eslint/eslint-plugin eslint-plugin-prettier的缩写
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 13,
    requireConfigFile: true,
    babelOptions: {
      babelrc: false,
      presets: ["@babel/preset-env"]
    },
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        tabWidth: 2,
        indent: 2,
        semi: true,
        trailingComma: "none", // 是否需要尾随逗号， none：表示须需要尾随逗号
        endOfLine: "lf"
      }
    ],
    // 禁止使用 var
    "no-var": "error",
    // 警告使用 console
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "off" : "warn",
    "linebreak-style": ["error", "unix"],
    // 优先使用 interface 而不是 type
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "no-unused-vars": "off",
    "vue/no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off"
  }
};
