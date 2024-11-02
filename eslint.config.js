// @ts-check

import eslint from "@eslint/js";
import eslintSecurity from "eslint-plugin-security";
import eslintSimpleImportSort from "eslint-plugin-simple-import-sort";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintUnusedImport from "eslint-plugin-unused-imports";
import tsEslint from "typescript-eslint";

// noinspection JSUnusedGlobalSymbols
export default tsEslint.config(
  { ignores: ["lib/", "example/"] },
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintSecurity.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["src/**/*"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        sourceType: "module",
      },
    },
    plugins: {
      "simple-import-sort": eslintSimpleImportSort,
      "unused-imports": eslintUnusedImport,
    },
    rules: {
      "comma-dangle": ["error", "always-multiline"],
      "linebreak-style": ["error", "unix"],
      semi: ["error", "always"],
      "max-len": [
        "error",
        {
          code: 100,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "security/detect-object-injection": "off",
      "simple-import-sort/imports": [
        "error",
        { groups: [["^.*\\u0000$", "^\\u0000", "^node:", "^@?\\w", "^", "^\\."]] },
      ],
      "simple-import-sort/exports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "unused-imports/no-unused-imports": "error",
    },
  },
);
