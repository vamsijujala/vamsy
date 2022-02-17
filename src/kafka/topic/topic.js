const { Kafka } = require("kafkajs");
const kafka_config = require('../../config/kafka_config.json');

async function Topic() {
  try {
    const kafka = new Kafka({
      clientId: kafka_config.CLIENT_ID,
      brokers: [kafka_config.BROKER_IP],
    });

    const admin = kafka.admin();
    console.log("Connecting Kafka Server....");
    await admin.connect();
    console.log("Connected!!!");
    await admin.createTopics({
      topics: [
        {
          topic: kafka_config.TOPIC,
          numPartitions: kafka_config.NUM_PARTITION,
        },
      ],
    });
    console.log("Done!!");
    await admin.disconnect();
  } catch (error) {
    console.error("Kafka Topic Error:", error);
  } 
}
module.exports = Topic; 