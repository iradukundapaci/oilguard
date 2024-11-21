import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UserRole } from "src/__shared__/enums/user-role.enum";

export namespace CreatePipelineDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    lastInspectionDate: Date;

    @IsNumber()
    @IsNotEmpty()
    pipeLineAge: number;
  }

  export class Output {
    name: string;
    location: string;
    status: UserRole;
    lastInspectionDate: Date;
  }
}
