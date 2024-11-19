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
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { FetchPipelineDto } from "src/pipeline/dto/fetch-pipeline.dto";
import { UpdatePipelineDto } from "src/pipeline/dto/update-pipeline.dto";
import { CreatePipelineDto } from "./dto/create-pipeline.dto";
import { PipelineService } from "./pipeline.service";

@ApiTags("Pipeline")
@Controller("pipelines")
export class PipelineController {
  constructor(private readonly pipelinesService: PipelineService) {}

  @PostOperation("", "Create new pipeline")
  @CreatedResponse()
  @Authorize(JwtGuard)
  @ApiRequestBody(CreatePipelineDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async createPipeline(@Body() createPipelineDto: CreatePipelineDto.Input) {
    await this.pipelinesService.createPipeline(createPipelineDto);
    return new GenericResponse("Pipeline created successfully");
  }

  @GetOperation("", "Get all pipelines")
  @PaginatedOkResponse(FetchPipelineDto.Output)
  @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse)
  async getAllPipeline(
    @Query() fetchPipelineDto: FetchPipelineDto.Input,
  ): Promise<GenericResponse<FetchPipelineDto.Output>> {
    const result =
      await this.pipelinesService.findAllPipeline(fetchPipelineDto);
    return new GenericResponse("Pipeline retrieved successfully", result);
  }

  @GetOperation(":id", "Get pipeline by id")
  @OkResponse(CreatePipelineDto.Output)
  @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getCustomer(
    @Param("id") id: number,
  ): Promise<GenericResponse<CreatePipelineDto.Output>> {
    const pipeline = await this.pipelinesService.findPipelineById(id);
    const outPut = plainToInstance(CreatePipelineDto.Output, pipeline);
    return new GenericResponse("Pipeline retrieved successfully", outPut);
  }

  @PatchOperation(":id", "Update pipeline")
  @OkResponse(UpdatePipelineDto.Output)
  @Authorize(JwtGuard)
  @ApiRequestBody(UpdatePipelineDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateCustomer(
    @Param("id") id: number,
    @Body() updatePipelineDto: UpdatePipelineDto.Input,
  ): Promise<GenericResponse<UpdatePipelineDto.Output>> {
    const pipeline = await this.pipelinesService.updatePipelineById(
      id,
      updatePipelineDto,
    );
    const outPut = plainToInstance(UpdatePipelineDto.Output, pipeline);
    return new GenericResponse("Pipeline updated successfully", outPut);
  }

  @DeleteOperation(":id", "Delete pipeline")
  @OkResponse()
  @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeCustomer(@Param("id") id: number) {
    await this.pipelinesService.removePipelineById(id);
    return new GenericResponse("Pipeline deleted successfully");
  }
}
