import { Controller, Body, Query, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import {
  PostOperation,
  CreatedResponse,
  ErrorResponses,
  UnauthorizedResponse,
  ForbiddenResponse,
  GetOperation,
  PaginatedOkResponse,
  OkResponse,
  PatchOperation,
  ApiRequestBody,
  DeleteOperation,
} from "src/__shared__/decorators";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { FetchReportDto } from "./dto/fetch-report.dto";
import { ReportDto } from "./dto/report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { GetUser } from "src/auth/decorators/get-user.decorator";

@ApiTags("Report")
@Controller("reports")
export class ReportController {
  constructor(private readonly reportsService: ReportService) {}

  @PostOperation("", "Create report")
  @CreatedResponse()
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  @Authorize(JwtGuard)
  async createReport(
    @Body() createReportDto: CreateReportDto.Input,
    @GetUser("id") userId: number,
  ): Promise<GenericResponse> {
    await this.reportsService.createReport(userId, createReportDto);
    return new GenericResponse("Report created successfully");
  }

  @GetOperation("", "Get all reports")
  @PaginatedOkResponse(FetchReportDto.Output)
  @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getAllReport(@Query() fetchReportDto: FetchReportDto.Input) {
    const response = await this.reportsService.findAllReport(fetchReportDto);
    return new GenericResponse("Report retrieved successfully", response);
  }

  @GetOperation(":id", "Get report")
  @OkResponse(ReportDto.Output)
  @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getReport(
    @Param("id") id: number,
  ): Promise<GenericResponse<ReportDto.Output>> {
    const report = await this.reportsService.findReportById(id);
    const output = plainToInstance(ReportDto.Output, report);

    return new GenericResponse("Report retrieved successfully", output);
  }

  @PatchOperation(":id", "Update report")
  @OkResponse()
  @Authorize(JwtGuard)
  @ApiRequestBody(ReportDto.Output)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateReport(
    @Param("id") id: number,
    @Body() updateReportDto: UpdateReportDto.Input,
  ): Promise<GenericResponse<ReportDto.Output>> {
    let outPut = await this.reportsService.updateReportById(
      id,
      updateReportDto,
    );
    outPut = plainToInstance(ReportDto.Output, outPut);
    return new GenericResponse("Report updated successfully", outPut);
  }

  @DeleteOperation(":id", "Delete report")
  @OkResponse()
  @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeReport(@Param("id") id: number): Promise<GenericResponse> {
    await this.reportsService.removeReportById(id);
    return new GenericResponse("Report deleted successfully");
  }
}
