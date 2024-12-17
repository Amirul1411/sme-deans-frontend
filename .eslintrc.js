module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  parser: "babel-eslint",
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: "module"
  },
  plugins: ["react", "prettier"],
  settings: {
    react: {
      version: "16.4.1"
    }
  },
  rules: {
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "eqeqeq": "error",
    "no-console": "warn",
    "react/display-name": "error",
    "prettier/prettier": "error",
    "complexity": ["error", 15]
  }
};
