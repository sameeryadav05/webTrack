import {createClient} from 'redis'
import dotenv from 'dotenv'
dotenv.config();

let redis;

export const connectRedis = async ()=>
{
    try {
        redis = createClient({url:process.env.REDIS_URL});
        
        redis.on('error',(err)=>{
            console.log("Redis Error ",err);
        })

        await redis.connect();
        console.log("Redis Connected");

        
    } catch (error) {
        console.log(error);
    }
}

export function getRedisClient()
{
    if(!redis)
    {
        console.log('Redis Client Not found !');
        return null;
    }
    return redis;
}

