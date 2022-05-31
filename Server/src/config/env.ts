import "dotenv/config";
interface Env {
  PORT: string;
  MONGO_URI: string;
  SMTP_SERVER: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  SECRET: string;
  URL_PRODUCTION: string;
  URL_DEV: string;
  WEBSITES_PORT: string;
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



  if (typeof parsedEnv.APPSETTING_SMTP_SERVER === "string")
    parsedEnv.SMTP_SERVER = parsedEnv.APPSETTING_SMTP_SERVER;

  if (typeof parsedEnv.SMTP_SERVER !== "string")
    throw new Error("env.SMTP_SERVER is missing");



  if (typeof parsedEnv.APPSETTING_SMTP_PORT === "string")
    parsedEnv.SMTP_PORT = parsedEnv.APPSETTING_SMTP_PORT;

  if (typeof parsedEnv.SMTP_PORT !== "string")
    throw new Error("env.SMTP_PORT is missing");

  env.SMTP_PORT = parseInt(parsedEnv.SMTP_PORT) as any;

  if (Number.isNaN(parsedEnv.SMTP_PORT))
    throw new Error("env.SMTP_PORT needs to be a number.");




  if (typeof parsedEnv.APPSETTING_SMTP_USER === "string")
    parsedEnv.SMTP_USER = parsedEnv.APPSETTING_SMTP_USER;

  if (typeof parsedEnv.SMTP_USER !== "string")
    throw new Error("env.SMTP_USER is missing");



  if (typeof parsedEnv.APPSETTING_SMTP_PASS === "string")
    parsedEnv.SMTP_PASS = parsedEnv.APPSETTING_SMTP_PASS;

  if (typeof parsedEnv.SMTP_PASS !== "string")
    throw new Error("env.SMTP_PASS is missing");




  if (typeof parsedEnv.APPSETTING_SECRET === "string")
  parsedEnv.SECRET = parsedEnv.APPSETTING_SECRET;  

  if (typeof parsedEnv.SECRET !== "string") throw new Error("env.SECRET is missing");




  if (typeof parsedEnv.APPSETTING_PRODUCTION === "string")
    parsedEnv.PRODUCTION = parsedEnv.APPSETTING_PRODUCTION;

  if (typeof parsedEnv.URL_PRODUCTION !== "string")
    throw new Error("env.URL_PRODUCTION is missing");




  if (typeof parsedEnv.APPSETTING_URL_DEV === "string")
    parsedEnv.URL_DEV = parsedEnv.APPSETTING_URL_DEV;  

  if (typeof env.URL_DEV !== "string")
    throw new Error("env.URL_DEV is missing");

  return parsedEnv as unknown as Env;

  
}

export default parseEnv(process.env);
