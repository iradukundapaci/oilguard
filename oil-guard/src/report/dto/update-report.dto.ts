import { IsString, IsOptional } from "class-validator";

export namespace UpdateReportDto {
  export class Input {
    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    description?: string;
  }
}
