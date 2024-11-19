import { PaginationDto } from "src/__shared__/dto/pagination.dto";

export namespace FetchAnomalyDto {
  export class Input extends PaginationDto {}

  export class Output {
    id: number;
    pipelineName: string;
    severity: string;
    predictionModel: string;
    status: string;
    detectAt: string;
  }
}
