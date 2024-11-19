import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { Repository } from "typeorm";
import { CreateSensorDto } from "./dto/create-sensor.dto";
import { UpdateSensorDto } from "./dto/update-sensor.dto";
import { Sensor } from "./entities/sensor.entity";
import { PipelineService } from "src/pipeline/pipeline.service";
import { FetchSensorDto } from "./dto/fetch-sensor.dto";

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
    private readonly pipelineService: PipelineService,
  ) {}
  async createSensor(createSensorDto: CreateSensorDto.Input): Promise<void> {
    const pipeline = await this.pipelineService.findPipelineById(
      createSensorDto.pipeline,
    );

    const sensor = plainToInstance(Sensor, createSensorDto);
    sensor.pipeline = pipeline;
    await this.sensorRepository.save(sensor);
  }

  async findAllSensor(dto: FetchSensorDto.Input): Promise<any> {
    const queryBuilder = this.sensorRepository
      .createQueryBuilder("sensor")
      .leftJoinAndSelect("sensor.pipeline", "pipeline")
      .orderBy("sensor.id", "DESC");

    if (dto.online) {
      queryBuilder.andWhere("sensor.online = :online", { online: dto.online });
    }

    return await paginate<FetchSensorDto.Output>(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findSensorById(id: number): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({
      where: { id },
    });

    if (!sensor) {
      throw new NotFoundException(`Sensor with id ${id + 1} not found`);
    }
    return sensor;
  }

  async updateSensorById(
    id: number,
    updateSensorDto: UpdateSensorDto.Input,
  ): Promise<Sensor> {
    const sensor = await this.findSensorById(id);
    const updatedSensor = plainToInstance(Sensor, {
      ...sensor,
      ...updateSensorDto,
    });
    await this.sensorRepository.save(updatedSensor);
    return updatedSensor;
  }

  async removeSensorById(id: number) {
    const sensor = await this.findSensorById(id);

    if (!sensor) {
      throw new NotFoundException("Sensor not found");
    }

    await this.sensorRepository.remove(sensor);
  }
}
