import { Module } from "@nestjs/common";
import { AdminSeedService } from "./admin-seed.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Pipeline } from "src/pipeline/entities/pipeline.entity";
import { Sensor } from "src/sensor/entities/sensor.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Pipeline, Sensor])],
  providers: [AdminSeedService],
  exports: [AdminSeedService],
})
export class SeedModule {}
