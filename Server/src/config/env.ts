import "dotenv/config";
interface Env {
  WEBSITES_PORT: string;
  MONGO_URI: string;
}

function parseEnv(env: NodeJS.ProcessEnv): Env {
  const parsedEnv = { ...env };
  
  if (typeof parsedEnv.APPSETTING_WEBSITES_PORT === "string")
    parsedEnv.WEBSITES_PORT = parsedEnv.APPSETTING_WEBSITES_PORT;

  if (typeof parsedEnv.WEBSITES_PORT !== "string")
    throw new Error("env.WEBSITES_PORT is missing");

  if (typeof parsedEnv.APPSETTING_MONGO_URI === "string")
    parsedEnv.MONGO_URI = parsedEnv.APPSETTING_MONGO_URI;
  if (typeof parsedEnv.MONGO_URI !== "string")
    throw new Error("env.MONGO_URI is missing");

  return parsedEnv as unknown as Env;
}
export default parseEnv(process.env);
