import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import importPlugin from "eslint-plugin-import";
import boundaries from "eslint-plugin-boundaries";

// During the workshop this can be set to "false" in order to not
// get annoying messages due to import statements in wrong order
const enableImportRules = true;

const importRules = enableImportRules
  ? {
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
    }
  : {};
export default tseslint.config(
  { ignores: ["dist", "public/mockServiceWorker.js", "src/routeTree.gen.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
      import: importPlugin,
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        /* todo 'src' entfernen, deine Pattern hier eintragen für die Typen mit
         * den entsprechenden Pattern:
         *
         *   routes
         *   plant-list
         *   plant-form
         *   plant-detail
         *   shared
         */
        { type: "src", pattern: "src/*" },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/method-signature-style": "off",
      "prefer-const": "off",
      ...importRules,
      "boundaries/dependencies": [
        "error",
        {
          // todo: 'default' auf 'disallow' setzen
          default: "allow",
          policies: [/* todo: deine Policy eintragen */],
        },
      ],
    },
  },
);
