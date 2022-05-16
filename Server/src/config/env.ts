import "dotenv/config";
interface Env {
    PORT: string,
    MONGO_URI: string,
    SMTP_SERVER: string,
    SMTP_PORT: number,
    SMTP_USER: string,
    SMTP_PASS: string,
    SECRET: string 
}

 function parseEnv(env : NodeJS.ProcessEnv ): Env {

    if (typeof env.PORT !== "string" ) throw new Error("env.PORT is missing");

    if (typeof env.MONGO_URI !== "string" ) throw new Error("env.MONGO_URI is missing");

    if (typeof env.SMTP_SERVER !== "string" ) throw new Error("env.SMTP_SERVER is missing");

    if (typeof env.SMTP_PORT !== "string" ) throw new Error("env.SMTP_PORT is missing");
    env.SMTP_PORT = parseInt(env.SMTP_PORT) as any
    if(Number.isNaN(env.SMTP_PORT)) throw new Error("env.SMTP_PORT needs to be a number.")

    if (typeof env.SMTP_USER !== "string" ) throw new Error("env.SMTP_USER is missing");

    if (typeof env.SMTP_PASS !== "string" ) throw new Error("env.SMTP_PASS is missing");

    if (typeof env.SECRET !== "string" ) throw new Error("env.SECRET is missing");
    
    
    
    return env as unknown as Env

 }
export default parseEnv(process.env)