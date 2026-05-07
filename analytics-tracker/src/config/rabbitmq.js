import amqp from "amqplib";

let channel;

export const Queue = "tracking_events";

export const connectRabbitMq = async (
  url = "amqp://localhost"
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