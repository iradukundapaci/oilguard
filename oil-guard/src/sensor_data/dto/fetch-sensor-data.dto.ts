import { PaginationDto } from "src/__shared__/dto/pagination.dto";
import { UpdateSensorDto } from "src/sensor/dto/update-sensor.dto";

export namespace FetchSensorDataDto {
  export class Input extends PaginationDto {}

  export class Output {
    id: number;
    sensor: UpdateSensorDto.Output;
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
