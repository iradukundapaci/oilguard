import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { CreateAnomalyDto } from "./dto/create-anomaly.dto";
import { FetchAnomalyDto } from "./dto/fetch-anomaly.dto";
import { AnomalyDto } from "./dto/anomaly.dto";
import { UpdateAnomalyDto } from "./dto/update-anomaly.dto";
import { Anomaly } from "./entities/anomaly.entity";
import { PipelineService } from "../pipeline/pipeline.service";

@Injectable()
export class AnomalyService {
  constructor(
    @InjectRepository(Anomaly)
    private readonly anomalyRepository: Repository<Anomaly>,
    private readonly pipelineService: PipelineService,
  ) {}
  async createAnomaly(createAnomalyDto: CreateAnomalyDto.Input): Promise<void> {
    const pipeline = await this.pipelineService.findPipelineById(
      +createAnomalyDto.pipelineId,
    );

    if (!pipeline) {
      throw new ConflictException("Pipeline doesn't exists");
    }

    const newAnomaly = plainToInstance(Anomaly, {
      ...createAnomalyDto,
    });
    newAnomaly.pipeline = pipeline;

    await this.anomalyRepository.save(newAnomaly);
  }

  async findAllAnomaly(dto: FetchAnomalyDto.Input): Promise<any> {
    const queryBuilder = this.anomalyRepository
      .createQueryBuilder("anomaly")
      .leftJoinAndSelect("anomaly.pipeline", "pipeline")
      .orderBy("anomaly.id", "DESC");

    return await paginate<Anomaly>(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findAnomalyById(id: number): Promise<Anomaly> {
    const anomaly = await this.anomalyRepository.findOne({
      where: { id },
    });

    if (!anomaly) {
      throw new NotFoundException("Anomaly not found");
    }

    return anomaly;
  }

  async updateAnomalyById(
    id: number,
    updateAnomalyDto: UpdateAnomalyDto.Input,
  ): Promise<AnomalyDto.Output> {
    const anomaly = await this.findAnomalyById(id);

    if (!anomaly) {
      throw new NotFoundException("Anomaly not found");
    }

    let updatedAnomaly = plainToInstance(Anomaly, {
      ...anomaly,
      ...updateAnomalyDto,
    });

    updatedAnomaly = await this.anomalyRepository.save(updatedAnomaly);
    return plainToInstance(AnomalyDto.Output, updatedAnomaly);
  }

  async removeAnomalyById(id: number): Promise<void> {
    const anomaly = await this.findAnomalyById(id);
    if (!anomaly) {
      throw new NotFoundException("Anomaly not found");
    }

    await this.anomalyRepository.remove(anomaly);
  }
}
