import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
export default defineConfig([
    {
        ignores: [
            "allure-report",
            "playwright-report",
            "coverage",
            "dist",
            "build"
        ]
    },
    ...tseslint.configs.recommended,
    {
        files: ["**/*.ts"],
        languageOptions: {
            globals: globals.browser
        },
        rules: {
            indent: ["error", 4]
        }
    }
]);
