import { IsString, IsOptional } from "class-validator";

export namespace UpdateAnomalyDto {
  export class Input {
    @IsString()
    @IsOptional()
    pipelineId: string;

    @IsString()
    @IsOptional()
    severity: string;

    @IsString()
    @IsOptional()
    predictionModel: string;

    @IsString()
    @IsOptional()
    status: string;

    @IsString()
    @IsOptional()
    detectAt: Date;
  }
  export class Output {
    id: number;
    pipelineName: string;
    severity: string;
    predictionModel: string;
    status: string;
    detectAt: string;
  }
}
