import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { connect, MqttClient } from "mqtt";
import { Server } from "socket.io";
import { MqttService } from "./mqtt.service";
import { ConfigService } from "@nestjs/config";
import { IAppConfig } from "src/__shared__/interfaces/app-config.interface";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class MqttGateway implements OnModuleInit {
  private client: MqttClient;
  private host: string;
  private port: string;

  constructor(
    private readonly mqttService: MqttService,
    private readonly config: ConfigService<IAppConfig>,
  ) {
    this.host = this.config.get("mqtt").host;
    this.port = this.config.get("mqtt").port;
  }

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.client = connect(`mqtt://${this.host}:${this.port}`);

    this.client.on("connect", () => {
      console.log("Connected to MQTT broker");
      this.subscribeToTopics();
    });

    this.client.on("message", (topic, message) => {
      this.handleMessage(topic, message.toString());
    });

    this.client.on("error", (error) => {
      console.error("MQTT error:", error.message);
    });
  }

  private subscribeToTopics() {
    // Subscribe to both sensor/data and prediction topics
    this.client.subscribe("sensor/data", (err) => {
      if (err) {
        console.error("Subscription error:", err.message);
      } else {
        console.log("Subscribed to topic: sensor/data");
      }
    });

    this.client.subscribe("sensor/predictions", (err) => {
      if (err) {
        console.error("Subscription error:", err.message);
      } else {
        console.log("Subscribed to topic: prediction");
      }
    });
  }

  private handleMessage(topic: string, message: string) {
    if (topic === "sensor/data") {
      this.server.emit("sensor-data", JSON.parse(message));
      this.mqttService.create(message);
    }

    if (topic === "sensor/predictions") {
      this.server.emit("prediction", JSON.parse(message));
    }
  }
}
