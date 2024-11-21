import { IsNotEmpty, IsString } from "class-validator";

export namespace CreateReportDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    pipelineName: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    status: string;
  }
}
