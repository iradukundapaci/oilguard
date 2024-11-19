import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pipeline } from "./entities/pipeline.entity";
import { PipelineController } from "./pipeline.controller";
import { PipelineService } from "./pipeline.service";

@Module({
  imports: [TypeOrmModule.forFeature([Pipeline])],
  controllers: [PipelineController],
  providers: [PipelineService],
  exports: [PipelineService],
})
export class PipelineModule {}
