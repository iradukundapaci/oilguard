import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { Module } from "@nestjs/common";
import { PipelineModule } from "src/pipeline/pipeline.module";
import { UsersModule } from "src/users/users.module";
import { Reports } from "./entities/report.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Reports]), PipelineModule, UsersModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
