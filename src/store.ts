import * as IoRedis from 'ioredis';

import {
    redishost,
    redisport
} from "./config";

let Redis = new IoRedis(redisport, redishost);

export { Redis };
