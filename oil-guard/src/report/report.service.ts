import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { Repository } from "typeorm";
import { CreateReportDto } from "./dto/create-report.dto";
import { FetchReportDto } from "./dto/fetch-report.dto";
import { ReportDto } from "./dto/report.dto";
import { PipelineService } from "src/pipeline/pipeline.service";
import { UsersService } from "src/users/users.service";
import { UpdateReportDto } from "./dto/update-report.dto";
import { Reports } from "./entities/report.entity";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Reports)
    private readonly reportRepository: Repository<Reports>,
    private readonly pipelineService: PipelineService,
    private readonly userService: UsersService,
  ) {}
  async createReport(
    userId: number,
    createReportDto: CreateReportDto.Input,
  ): Promise<void> {
    const user = await this.userService.findUserById(userId);
    const pipeline = await this.pipelineService.findPipelineByName(
      createReportDto.pipelineName,
    );

    if (!user || !pipeline) {
      throw new NotFoundException("User or pipeline not found");
    }

    const newReport = plainToInstance(Reports, {
      ...createReportDto,
    });

    newReport.pipeline = pipeline;
    newReport.user = user;

    await this.reportRepository.save(newReport);
  }

  async findAllReport(dto: FetchReportDto.Input): Promise<any> {
    const query = this.reportRepository
      .createQueryBuilder("reports")
      .leftJoinAndSelect("reports.user", "user")
      .leftJoinAndSelect("reports.pipeline", "pipeline")
      .select([
        "reports.id",
        "reports.description",
        "reports.status",
        "user.names",
        "pipeline.name",
        "reports.createdAt",
      ])
      .orderBy("reports.id", "DESC");

    return await paginate(query, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findReportById(id: number): Promise<Reports> {
    const report = await this.reportRepository.findOne({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException("Report not found");
    }

    return report;
  }

  async updateReportById(
    id: number,
    updateReportDto: UpdateReportDto.Input,
  ): Promise<ReportDto.Output> {
    const report = await this.findReportById(id);

    if (!report) {
      throw new NotFoundException("Report not found");
    }

    let updatedReport = plainToInstance(Reports, {
      ...report,
      ...updateReportDto,
    });

    updatedReport = await this.reportRepository.save(updatedReport);
    return plainToInstance(ReportDto.Output, updatedReport);
  }

  async removeReportById(id: number): Promise<void> {
    const report = await this.findReportById(id);
    if (!report) {
      throw new NotFoundException("Report not found");
    }

    await this.reportRepository.remove(report);
  }
}
