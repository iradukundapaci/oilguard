import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Anomaly } from "./entities/anomaly.entity";
import { AnomalyController } from "./anomaly.controller";
import { AnomalyService } from "./anomaly.service";
import { PipelineModule } from "src/pipeline/pipeline.module";

@Module({
  imports: [TypeOrmModule.forFeature([Anomaly]), PipelineModule],
  controllers: [AnomalyController],
  providers: [AnomalyService],
})
export class AnomalyModule {}
