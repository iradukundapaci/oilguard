import { IsNotEmpty, IsString } from "class-validator";

export namespace CreateSensorDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    pipelineName: string;

    @IsString()
    @IsNotEmpty()
    latitude: string;

    @IsString()
    @IsNotEmpty()
    longitude: string;
  }
}
