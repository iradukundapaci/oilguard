import { IsOptional } from "class-validator";
import { PaginationDto } from "src/__shared__/dto/pagination.dto";
import { UserRole } from "src/__shared__/enums/user-role.enum";

export namespace FetchPipelineDto {
  export class Input extends PaginationDto {
    @IsOptional()
    q?: string;
  }

  export class Output {
    id: number;
    name: string;
    location: string;
    status: UserRole;
    lastInspectionDate: Date;
  }
}
