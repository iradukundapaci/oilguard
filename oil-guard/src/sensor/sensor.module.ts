import { Module } from "@nestjs/common";
import { SensorService } from "./sensor.service";
import { SensorController } from "./sensor.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sensor } from "./entities/sensor.entity";
import { PipelineModule } from "src/pipeline/pipeline.module";

@Module({
  imports: [TypeOrmModule.forFeature([Sensor]), PipelineModule],
  controllers: [SensorController],
  providers: [SensorService],
  exports: [SensorService],
})
export class SensorModule {}
