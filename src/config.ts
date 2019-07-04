/*
 * Project config
 */

let env = process.env;

let listenaddr   = env.LISTENADDR           || '127.0.0.1';
let listenport   = parseInt(env.LISTENPORT) || 3000;
let redishost    = env.REDIS_HOST           || '127.0.0.1';
let redisport    = parseInt(env.REDIS_PORT) ||  6379;

export {
    listenaddr,
    listenport,
    redishost,
    redisport
}