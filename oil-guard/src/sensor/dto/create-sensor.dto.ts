import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export namespace CreateSensorDto {
  export class Input {
    @IsNumber()
    @IsNotEmpty()
    pipeline: number;

    @IsString()
    @IsNotEmpty()
    latitude: string;

    @IsString()
    @IsNotEmpty()
    longitude: string;
  }
}
