import { IsString, IsOptional } from "class-validator";

export namespace UpdateSensorDto {
  export class Input {
    @IsString()
    @IsOptional()
    latitude?: string;

    @IsString()
    @IsOptional()
    longitude?: string;

    @IsString()
    @IsOptional()
    online?: string;
  }

  export class Output {
    id: number;
    latitude: string;
    longitude: string;
    online: boolean;
  }
}
