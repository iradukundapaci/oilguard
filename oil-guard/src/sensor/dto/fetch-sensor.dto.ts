import { IsOptional } from "class-validator";
import { PaginationDto } from "src/__shared__/dto/pagination.dto";

export namespace FetchSensorDto {
  export class Input extends PaginationDto {
    @IsOptional()
    online?: boolean;

    @IsOptional()
    q?: string;
  }

  export class Output {
    id: number;
    latitude: string;
    longitude: string;
    online: boolean;
  }
}
