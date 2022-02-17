const { json } = require("express/lib/response");
const { Kafka } = require("kafkajs");
const kafka_config = require("../../config/kafka_config.json");

async function Producer(msg) {
  try {
    const kafka = new Kafka({
      clientId: kafka_config.CLIENT_ID,
      brokers: [kafka_config.BROKER_IP],
    });

    const producer = kafka.producer();
     console.log("Connecting Kafka Server....");
    await producer.connect();
    console.log("Connected !!!");
    const result = await producer.send({
      topic: kafka_config.TOPIC,
      messages: [
        {
          value: msg,
          partition: 0,
        },
      ],
    });
    console.log("send to broker !!", JSON.stringify(result));
    await producer.disconnect();
  } catch (error) {
    console.error("Kafka Producer Error:", error);
  } 
  // finally {
  //   process.exit(0);
  // }
}

module.exports =  Producer;