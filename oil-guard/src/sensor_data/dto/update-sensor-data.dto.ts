import { PartialType } from "@nestjs/swagger";
import { CreateSensorDataDto } from "./create-sensor-data.dto";

export namespace UpdateSensorDataDto {
  export class Input extends PartialType(CreateSensorDataDto.Input) {}
  export class Output {
    id: number;
    avgInflow: number;
    avgOutflow: number;
    pressure: number;
    flowRate: number;
    vibration: number;
    temperature: number;
    humidity: number;
    precipitation: number;
    timestamp: string;
  }
}
