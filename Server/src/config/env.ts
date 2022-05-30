import "dotenv/config";
interface Env {
    WEBSITES_PORT: string,
    MONGO_URI: string 
}

 function parseEnv(env : NodeJS.ProcessEnv ): Env {

    if (typeof env.WEBSITES_PORT !== "string" ) throw new Error("env.WEBSITES_PORT is missing");

    if (typeof env.MONGO_URI !== "string" ) throw new Error("env.MONGO_URI is missing");
    
    return env as unknown as Env

 }
export default parseEnv(process.env)