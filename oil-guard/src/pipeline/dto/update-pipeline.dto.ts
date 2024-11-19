import { IsString, IsOptional } from "class-validator";
import { UserRole } from "src/__shared__/enums/user-role.enum";

export namespace UpdatePipelineDto {
  export class Input {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    lastInspectionDate?: Date;
  }

  export class Output {
    id: number;
    name: string;
    location: string;
    status: UserRole;
    lastInspectionDate: Date;
  }
}
