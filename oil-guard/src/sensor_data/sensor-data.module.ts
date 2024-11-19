import { Module } from "@nestjs/common";
import { SensorData } from "./entities/sensor-data.entity";
import { SensorDataController } from "./sensor-data.controller";
import { SensorDataService } from "./sensor-data.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SensorModule } from "src/sensor/sensor.module";

@Module({
  imports: [TypeOrmModule.forFeature([SensorData]), SensorModule],
  controllers: [SensorDataController],
  providers: [SensorDataService],
  exports: [SensorDataService],
})
export class SensorDataModule {}
