const { json } = require("express/lib/response");
const { Kafka } = require("kafkajs");
const kafka_config = require("../../config/kafka_config.json");

async function Consumer(io) {
  try {
    const kafka = new Kafka({
      clientId: kafka_config.CLIENT_ID,
      brokers: [kafka_config.BROKER_IP],
    });

    const consumer = kafka.consumer({
      groupId: kafka_config.GROUP_ID,
    });
    console.log("Connecting Kafka Server....");
    await consumer.connect();
    console.log("Connected !!!");
    consumer.subscribe({
      topic: kafka_config.TOPIC,
      fromBeginning: kafka_config.FROM_START,
    });

    await consumer.run({
      eachMessage: async (result) => {
        var roughdata = result.message.value;
        roughdata = roughdata.toString();
        var data = await JSON.parse(roughdata);
        console.log(`Received Message: ${data}`);
        await io.emit("message", data);
      },
    });
  } catch (error) {
    console.error("Kafka Consumer Error:", error);
  }
}

module.exports = Consumer;