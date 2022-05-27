interface Env {
    REACT_APP_BING_MAPS: string,
}

 function parseEnv(env : NodeJS.ProcessEnv ): Env {

    if (typeof env.REACT_APP_BING_MAPS !== "string" ) throw new Error("env.REACT_APP_BING_MAPS is missing");
    return env as unknown as Env

 }
export default parseEnv(process.env)