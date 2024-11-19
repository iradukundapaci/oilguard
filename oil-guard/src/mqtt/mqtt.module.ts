import { Module } from "@nestjs/common";
import { MqttService } from "./mqtt.service";
import { MqttGateway } from "./mqtt.gateway";
import { SensorDataModule } from "src/sensor_data/sensor-data.module";

@Module({
  imports: [SensorDataModule],
  providers: [MqttGateway, MqttService],
})
export class MqttModule {}
