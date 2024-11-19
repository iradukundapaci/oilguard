import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { Repository } from "typeorm";
import { CreateSensorDataDto } from "./dto/create-sensor-data.dto";
import { FetchSensorDataDto } from "./dto/fetch-sensor-data.dto";
import { UpdateSensorDataDto } from "./dto/update-sensor-data.dto";
import { SensorData } from "./entities/sensor-data.entity";
import { SensorService } from "src/sensor/sensor.service";

@Injectable()
export class SensorDataService {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepository: Repository<SensorData>,
    private readonly sensorService: SensorService,
  ) {}

  async createSensorData(
    createSensorDataDto: CreateSensorDataDto.Input,
  ): Promise<void> {
    const sensor = await this.sensorService.findSensorById(
      createSensorDataDto.SensorId,
    );

    const sensorData = plainToInstance(SensorData, createSensorDataDto);
    sensorData.sensor = sensor;

    await this.sensorDataRepository.save(sensorData);
  }

  async findAllSensorData(dto: FetchSensorDataDto.Input): Promise<any> {
    const queryBuilder = this.sensorDataRepository
      .createQueryBuilder("sensorData")
      .leftJoinAndSelect("sensorData.sensor", "sensor")
      .orderBy("sensorData.id", "DESC");

    return await paginate(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findSensorDataById(id: number): Promise<SensorData> {
    const sensorData = await this.sensorDataRepository.findOne({
      where: { id },
    });
    if (!sensorData) {
      throw new Error("SensorData not found");
    }
    return sensorData;
  }

  async updateSensorDataById(
    id: number,
    updateSensorDataDto: UpdateSensorDataDto.Input,
  ): Promise<SensorData> {
    const sensorData = await this.findSensorDataById(id);
    const updatedSensorData = plainToInstance(SensorData, {
      ...sensorData,
      ...updateSensorDataDto,
    });
    await this.sensorDataRepository.save(updatedSensorData);
    return updatedSensorData;
  }

  async removeTaskById(id: number) {
    const sensorData = await this.findSensorDataById(id);

    if (!sensorData) {
      throw new Error("SensorData not found");
    }

    await this.sensorDataRepository.remove(sensorData);
  }
}
