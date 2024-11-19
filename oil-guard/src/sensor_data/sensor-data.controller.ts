import { Controller, Body, Query, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import {
  PostOperation,
  CreatedResponse,
  ApiRequestBody,
  ErrorResponses,
  UnauthorizedResponse,
  ForbiddenResponse,
  GetOperation,
  PaginatedOkResponse,
  OkResponse,
  DeleteOperation,
} from "src/__shared__/decorators";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { CreateSensorDataDto } from "./dto/create-sensor-data.dto";
import { FetchSensorDataDto } from "./dto/fetch-sensor-data.dto";
import { UpdateSensorDataDto } from "./dto/update-sensor-data.dto";
import { SensorDataService } from "./sensor-data.service";

@ApiTags("SensorData")
@Controller("sensorData")
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @PostOperation("", "Create SensorData")
  @CreatedResponse()
  @Authorize(JwtGuard)
  @ApiRequestBody(CreateSensorDataDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async createSensorData(
    @Body() createSensorDataDto: CreateSensorDataDto.Input,
  ) {
    await this.sensorDataService.createSensorData(createSensorDataDto);
    return new GenericResponse("SensorData created successfully");
  }

  @GetOperation("", "Find All SensorData")
  @PaginatedOkResponse(FetchSensorDataDto.Output)
  @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getAllSensorData(
    @Query() fetchSensorDataDto: FetchSensorDataDto.Input,
  ): Promise<GenericResponse<FetchSensorDataDto.Output>> {
    return await this.sensorDataService.findAllSensorData(fetchSensorDataDto);
  }

  @GetOperation(":id", "Find One SensorData")
  @OkResponse(UpdateSensorDataDto.Output)
  @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getSensorData(
    @Param("id") id: number,
  ): Promise<GenericResponse<UpdateSensorDataDto.Output>> {
    const sensorData = await this.sensorDataService.findSensorDataById(id);
    const output = plainToInstance(UpdateSensorDataDto.Output, sensorData);
    return new GenericResponse("SensorData retrieved successfully", output);
  }

  @PostOperation(":id", "Update SensorData")
  @OkResponse(UpdateSensorDataDto.Output)
  @Authorize(JwtGuard)
  @ApiRequestBody(UpdateSensorDataDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateSensorData(
    @Param("id") id: number,
    @Body() updateSensorDataDto: UpdateSensorDataDto.Input,
  ) {
    return this.sensorDataService.updateSensorDataById(id, updateSensorDataDto);
  }

  @DeleteOperation(":id", "Delete SensorData")
  @OkResponse()
  @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeSensorData(@Param("id") id: number) {
    await this.sensorDataService.removeTaskById(id);
    return new GenericResponse("SensorData deleted successfully");
  }
}
