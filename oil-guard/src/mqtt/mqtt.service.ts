import { Injectable } from "@nestjs/common";
import { CreateSensorDataDto } from "src/sensor_data/dto/create-sensor-data.dto";
import { SensorDataService } from "src/sensor_data/sensor-data.service";

@Injectable()
export class MqttService {
  constructor(private readonly sensorDataService: SensorDataService) {}

  async create(message: string): Promise<void> {
    try {
      const parsedMessage = JSON.parse(message);

      const sensorDataArray: CreateSensorDataDto.Input[] = Object.keys(
        parsedMessage,
      ).map((sensorId) => {
        const sensorData = parsedMessage[sensorId];

        return {
          SensorId: Number(sensorId),
          avgInflow: +sensorData.avg_inflow,
          avgOutflow: +sensorData.avg_outflow,
          pressure: +sensorData.pressure,
          flowRate: +sensorData.flow_rate,
          vibration: +sensorData.vibration,
          temperature: +sensorData.temperature,
          humidity: +sensorData.humidity,
          precipitation: +sensorData.precipitation,
          timestamp: new Date(sensorData.timestamp * 1000),
        };
      });

      sensorDataArray.forEach(async (sensorData) => {
        await this.sensorDataService.createSensorData(sensorData);
      });
    } catch (error) {
      throw error;
    }
  }
}
