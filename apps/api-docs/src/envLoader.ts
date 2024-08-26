import dotenv from "dotenv";

dotenv.config();

const env = {
  CREDENTIAL_AWS_ACCESS_KEY_ID: process.env.CREDENTIAL_AWS_ACCESS_KEY_ID ?? "",
  CREDENTIAL_AWS_SECRET_ACCESS_KEY:
    process.env.CREDENTIAL_AWS_SECRET_ACCESS_KEY ?? "",
  CREDENTIAL_GITHUB_ACCESS_TOKEN:
    process.env.CREDENTIAL_GITHUB_ACCESS_TOKEN ?? "",
};

const missingVariables = [];
for (let key in env) {
  if ((env as any)[key] === "") {
    missingVariables.push(key);
  }
}

if (missingVariables.length != 0) {
  const variables = missingVariables
    .map((variable) => `\t- ${variable}`)
    .join("\n");

  console.info(
    `❌ The following environment variables are required. Please set their values in the .env file:\n${variables}`
  );

  process.exit(1);
}

export default env;
