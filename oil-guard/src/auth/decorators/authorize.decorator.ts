import { UserRole } from "../../__shared__/enums/user-role.enum";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { RolesGuard } from "../guards/roles.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AllowRoles } from "./roles.decorator";

export function Authorize(guard, ...roles: UserRole[]) {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(guard, RolesGuard),
    AllowRoles(...roles),
  );
}
