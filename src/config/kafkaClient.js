import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "next-social",
  brokers: ["192.168.1.3:9092"],
});

export default kafka;
