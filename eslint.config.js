import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
      "tanstack-query": tanstackQuery,
    },
    rules: {
      // console警告
      "no-console": "warn",
      // 未使用变量警告
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          // 下划线开头的变量自动忽略（常用作占位变量）
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      // ✅ 强制检查 Hooks 依赖（缺失直接报错，不是警告）
      // "react-hooks/exhaustive-deps": "error",
      // ✅ 检查 Hooks 调用顺序（React 强制规则）
      // "react-hooks/rules-of-hooks": "error",

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  eslintConfigPrettier,
]);
