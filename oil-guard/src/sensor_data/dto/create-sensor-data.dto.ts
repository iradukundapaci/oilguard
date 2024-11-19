import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export namespace CreateSensorDataDto {
  export class Input {
    @IsNumber()
    @IsNotEmpty()
    SensorId: number;

    @IsNumber()
    @IsNotEmpty()
    avgInflow: number;

    @IsNumber()
    @IsNotEmpty()
    avgOutflow: number;

    @IsNumber()
    @IsNotEmpty()
    pressure: number;

    @IsNumber()
    @IsNotEmpty()
    flowRate: number;

    @IsNumber()
    @IsNotEmpty()
    vibration: number;

    @IsNumber()
    @IsNotEmpty()
    temperature: number;

    @IsNumber()
    @IsNotEmpty()
    humidity: number;

    @IsNumber()
    @IsNotEmpty()
    precipitation: number;

    @IsString()
    @IsNotEmpty()
    timestamp: Date;
  }
}
