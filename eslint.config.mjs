import nextConfig from "eslint-config-next";

const eslintConfig = [
  { ignores: ["database_template.mongodb.js"] },
  ...nextConfig,
];

export default eslintConfig;
