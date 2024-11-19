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
  PatchOperation,
  DeleteOperation,
} from "src/__shared__/decorators";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { CreateSensorDto } from "./dto/create-sensor.dto";
import { FetchSensorDto } from "./dto/fetch-sensor.dto";
import { UpdateSensorDto } from "./dto/update-sensor.dto";
import { SensorService } from "./sensor.service";

@ApiTags("Sensor")
@Controller("sensors")
export class SensorController {
  constructor(private readonly sensorsService: SensorService) {}

  @PostOperation("", "Create new sensor")
  @CreatedResponse()
  // @Authorize(JwtGuard)
  @ApiRequestBody(CreateSensorDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async createSensor(@Body() createSensorDto: CreateSensorDto.Input) {
    await this.sensorsService.createSensor(createSensorDto);
    return new GenericResponse("Sensor created successfully");
  }

  @GetOperation("", "Get all sensors")
  @PaginatedOkResponse(FetchSensorDto.Output)
  // @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse)
  async getAllSensor(
    @Query() fetchSensorDto: FetchSensorDto.Input,
  ): Promise<GenericResponse<FetchSensorDto.Output>> {
    const result = await this.sensorsService.findAllSensor(fetchSensorDto);
    return new GenericResponse("Sensor retrieved successfully", result);
  }

  @GetOperation(":id", "Get sensor by id")
  @OkResponse(UpdateSensorDto.Output)
  // @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getCustomer(
    @Param("id") id: number,
  ): Promise<GenericResponse<UpdateSensorDto.Output>> {
    const sensor = await this.sensorsService.findSensorById(id);
    const outPut = plainToInstance(UpdateSensorDto.Output, sensor);
    return new GenericResponse("Sensor retrieved successfully", outPut);
  }

  @PatchOperation(":id", "Update sensor")
  @OkResponse(UpdateSensorDto.Output)
  // @Authorize(JwtGuard)
  @ApiRequestBody(UpdateSensorDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateCustomer(
    @Param("id") id: number,
    @Body() updateSensorDto: UpdateSensorDto.Input,
  ): Promise<GenericResponse<UpdateSensorDto.Output>> {
    const sensor = await this.sensorsService.updateSensorById(
      id,
      updateSensorDto,
    );
    const outPut = plainToInstance(UpdateSensorDto.Output, sensor);
    return new GenericResponse("Sensor updated successfully", outPut);
  }

  @DeleteOperation(":id", "Delete sensor")
  @OkResponse()
  // @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeCustomer(@Param("id") id: number) {
    await this.sensorsService.removeSensorById(id);
    return new GenericResponse("Sensor deleted successfully");
  }
}
