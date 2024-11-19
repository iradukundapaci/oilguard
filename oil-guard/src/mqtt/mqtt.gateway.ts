import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway } from "@nestjs/websockets";
import { connect, MqttClient } from "mqtt";
import { MqttService } from "./mqtt.service";

@WebSocketGateway()
export class MqttGateway implements OnModuleInit {
  private client: MqttClient;

  constructor(private readonly mqttService: MqttService) {}

  onModuleInit() {
    this.client = connect("mqtt://localhost:1883");

    this.client.on("connect", () => {
      console.log("Connected to MQTT broker");
      this.subscribeToTopics();
    });

    this.client.on("message", (topic, message) => {
      this.handleMessage(message.toString());
    });

    this.client.on("error", (error) => {
      console.error("MQTT error:", error.message);
    });
  }

  private subscribeToTopics() {
    this.client.subscribe("sensor/data", (err) => {
      if (err) {
        console.error("Subscription error:", err.message);
      } else {
        console.log("Subscribed to topic: sensor/data");
      }
    });
  }

  private handleMessage(message: string) {
    // console.log("Received message:", message);
    this.mqttService.create(message);
  }
}
