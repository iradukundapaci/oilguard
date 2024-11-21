import { Controller, Body, Param, Query } from "@nestjs/common";
import {
  ApiRequestBody,
  CreatedResponse,
  DeleteOperation,
  ErrorResponses,
  ForbiddenResponse,
  GetOperation,
  OkResponse,
  PaginatedOkResponse,
  PatchOperation,
  PostOperation,
  UnauthorizedResponse,
} from "src/__shared__/decorators";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { plainToInstance } from "class-transformer";
import { ApiTags } from "@nestjs/swagger";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { AnomalyService } from "./anomaly.service";
import { CreateAnomalyDto } from "./dto/create-anomaly.dto";
import { FetchAnomalyDto } from "./dto/fetch-anomaly.dto";
import { AnomalyDto } from "./dto/anomaly.dto";
import { UpdateAnomalyDto } from "./dto/update-anomaly.dto";

@ApiTags("Anomaly")
@Controller("anomaly")
export class AnomalyController {
  constructor(private readonly anomalyService: AnomalyService) {}

  @PostOperation("", "Create anomaly")
  @CreatedResponse()
  @ApiRequestBody(CreateAnomalyDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async createAnomaly(
    @Body() createAnomalyDto: CreateAnomalyDto.Input,
  ): Promise<GenericResponse> {
    await this.anomalyService.createAnomaly(createAnomalyDto);

    return new GenericResponse("Anomaly created successfully");
  }

  @GetOperation("", "Get all anomaly")
  @PaginatedOkResponse(FetchAnomalyDto.Output)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getAllAnomaly(
    @Query() fetchAnomalyDto: FetchAnomalyDto.Input,
  ): Promise<GenericResponse<FetchAnomalyDto.Output>> {
    const result = await this.anomalyService.findAllAnomaly(fetchAnomalyDto);

    return new GenericResponse("Anomaly retrieved successfully", result);
  }

  @GetOperation(":id", "Get anomaly")
  @OkResponse(AnomalyDto.Output)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getAnomaly(
    @Param("id") id: number,
  ): Promise<GenericResponse<AnomalyDto.Output>> {
    const anomaly = await this.anomalyService.findAnomalyById(id);
    const output = plainToInstance(AnomalyDto.Output, anomaly);

    return new GenericResponse("Anomaly retrieved successfully", output);
  }

  @PatchOperation(":id", "Update anomaly")
  @OkResponse()
  @ApiRequestBody(UpdateAnomalyDto.Output)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateAnomaly(
    @Param("id") id: number,
    @Body() updateAnomalyDto: UpdateAnomalyDto.Input,
  ): Promise<GenericResponse<UpdateAnomalyDto.Output>> {
    let outPut = await this.anomalyService.updateAnomalyById(
      id,
      updateAnomalyDto,
    );
    outPut = plainToInstance(UpdateAnomalyDto.Output, outPut);
    return new GenericResponse("Anomaly updated successfully", outPut);
  }

  @DeleteOperation(":id", "Delete anomaly")
  @OkResponse()
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeAnomaly(@Param("id") id: number): Promise<GenericResponse> {
    await this.anomalyService.removeAnomalyById(id);
    return new GenericResponse("Anomaly deleted successfully");
  }
}
