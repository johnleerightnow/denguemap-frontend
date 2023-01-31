module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "import/prefer-default-export": "off",
    "no-console": "off",
    "no-underscore-dangle": 0,
    "no-warning-comments": [
      2,
      { terms: ["temp", "no-commit", "dont-commit"], location: "start" },
    ],
    "global-require": 0,
    quotes: "off",
    "quote-props": ["error", "consistent-as-needed"],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],

    "object-shorthand": ["error", "properties"],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],

    // * All react rules
    "react/destructuring-assignment": 0,
    "react/prop-types": 1,
  },
};
