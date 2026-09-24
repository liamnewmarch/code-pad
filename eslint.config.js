import js from "@eslint/js"
import globals from "globals"
import pluginVue from "eslint-plugin-vue"
import pluginImport from "eslint-plugin-import"
import tseslint from "typescript-eslint"
import vueParser from "vue-eslint-parser"

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    // TypeScript lives in .ts files and in .vue <script> blocks alike. vue-eslint-parser
    // covers both: it parses the SFC and delegates the script block, or delegates the
    // whole file when there's no SFC to parse.
    files: ["**/*.ts", "**/*.vue"],
    languageOptions: { parser: vueParser, parserOptions: { parser: tseslint.parser }},
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        VERSION: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "import": pluginImport,
    },
    rules: {
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "array-bracket-spacing": ["error", "never"],
      "arrow-parens": ["error", "always"],
      "block-spacing": ["error", "never"],
      "brace-style": "error",
      "camelcase": ["error", { properties: "never" }],
      "comma-dangle": ["error", "always-multiline"],
      "comma-spacing": "error",
      "comma-style": "error",
      "complexity": ["error", 8],
      "computed-property-spacing": "error",
      "curly": ["error", "multi-line"],
      "eol-last": "error",
      "func-call-spacing": "error",
      "func-style": ["error", "declaration", { allowArrowFunctions: false }],
      "generator-star-spacing": ["error", "after"],
      "guard-for-in": "error",
      "indent": ["error", 2, {
        CallExpression: { arguments: 2 },
        FunctionDeclaration: { body: 1, parameters: 2 },
        FunctionExpression: { body: 1, parameters: 2 },
        MemberExpression: 2,
        ObjectExpression: 1,
        SwitchCase: 1,
      }],
      "key-spacing": "error",
      "keyword-spacing": "error",
      "linebreak-style": "error",
      "max-depth": ["error", 3],
      "max-len": ["error", { code: 120, ignoreUrls: true }],
      "multiline-ternary": ["error", "never"],
      "new-cap": "error",
      "no-array-constructor": "error",
      "no-caller": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-invalid-this": "error",
      "no-multi-spaces": "error",
      "no-multi-str": "error",
      "no-multiple-empty-lines": ["error", { max: 2 }],
      "no-nested-ternary": "error",
      "no-new-object": "error",
      "no-new-wrappers": "error",
      "no-restricted-syntax": ["error", {
        message: "Use optional `?` or `void` instead of `undefined` in types",
        selector: "TSUndefinedKeyword",
      }, {
        message: "Use a for-of loop instead of .forEach()",
        selector: "CallExpression[callee.property.name='forEach']",
      }, {
        message: "Use a for-of loop instead of .reduce()",
        selector: "CallExpression[callee.property.name='reduce']",
      }],
      "no-tabs": "error",
      "no-throw-literal": "error",
      "no-trailing-spaces": "error",
      "no-undefined": "error",
      "no-unused-vars": ["error", { args: "none" }],
      "no-var": "error",
      "object-curly-spacing": ["error", "always", { objectsInObjects: false }],
      "one-var": ["error", { const: "never", let: "never", var: "never" }],
      "operator-linebreak": ["error", "after"],
      "padded-blocks": ["error", "never"],
      "prefer-const": ["error", { destructuring: "all" }],
      "prefer-promise-reject-errors": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "quote-props": ["error", "consistent"],
      "quotes": ["error", "double", { allowTemplateLiterals: true }],
      "require-await": "error",
      "rest-spread-spacing": "error",
      "semi": ["error", "never"],
      "semi-spacing": "error",
      "space-before-blocks": "error",
      "space-before-function-paren": ["error", {
        anonymous: "never",
        asyncArrow: "always",
        named: "never",
      }],
      "spaced-comment": ["error", "always"],
      "switch-colon-spacing": "error",
      "vue/max-len": ["error", { code: 120, ignoreUrls: true }],
      "yield-star-spacing": ["error", "after"],
    },
  },
  {
    files: ["eslint.config.js", "vite.config.ts"],
    rules: {
      "sort-keys": "error",
    },
  },
  {
    ignores: ["dist/**", "public/**", "src/env.d.ts"],
  },
]
