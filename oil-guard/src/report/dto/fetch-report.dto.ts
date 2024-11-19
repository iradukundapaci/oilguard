import { PaginationDto } from "src/__shared__/dto/pagination.dto";

export namespace FetchReportDto {
  export class Input extends PaginationDto {}

  export class Output {
    id: number;
    userName: string;
    pipelineName: string;
    description: string;
    status: string;
    createdAt: Date;
  }
}
