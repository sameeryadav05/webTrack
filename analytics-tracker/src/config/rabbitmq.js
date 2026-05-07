import amqp from 'amqplib'

let channel ;
const connectRabbitMq = async (url)=>{
    const connection = await amqp.connection(url);
    channel = await connection.createChannel;
    // const queue = 
                
}