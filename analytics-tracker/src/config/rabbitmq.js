import amqp from "amqplib";
import dotenv from 'dotenv'
dotenv.config()

let channel;

export const Queue = "tracking_events";

export const connectRabbitMq = async (
  url = process.env.RABBITMQ_URL
) => {

  try {

    const connection = await amqp.connect(url);

    channel = await connection.createChannel();

    console.log("RabbitMQ Connected");

  } catch (error) {

    console.log(
      "Failed to Connect RabbitMQ"
    );

    console.log(error);
  }
};

export const getChannel = () => {

  if (!channel) {

    console.log(
      "RabbitMQ Channel Not Found"
    );

    return null;
  }

  return channel;
};