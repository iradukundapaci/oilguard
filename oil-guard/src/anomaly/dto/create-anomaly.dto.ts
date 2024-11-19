import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export namespace CreateAnomalyDto {
  export class Input {
    @IsNumber()
    @IsNotEmpty()
    pipelineId: number;

    @IsString()
    @IsNotEmpty()
    severity: string;

    @IsString()
    @IsNotEmpty()
    predictionModel: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    detectedAt: Date;
  }
}
