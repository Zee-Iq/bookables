import "dotenv/config";
interface Env {
    PORT: string,
    MONGO_URI: string 
}

 function parseEnv(env : NodeJS.ProcessEnv ): Env {

    if (typeof env.PORT !== "string" ) throw new Error("env.PORT is missing");

    if (typeof env.MONGO_URI !== "string" ) throw new Error("env.MONGO_URI is missing");
    
    return env as unknown as Env

 }
export default parseEnv(process.env)