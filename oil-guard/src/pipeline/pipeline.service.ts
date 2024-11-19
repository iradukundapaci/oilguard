import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { FetchPipelineDto } from "src/pipeline/dto/fetch-pipeline.dto";
import { UpdatePipelineDto } from "src/pipeline/dto/update-pipeline.dto";
import { Repository } from "typeorm";
import { CreatePipelineDto } from "./dto/create-pipeline.dto";
import { Pipeline } from "./entities/pipeline.entity";

@Injectable()
export class PipelineService {
  constructor(
    @InjectRepository(Pipeline)
    private readonly pipelineRepository: Repository<Pipeline>,
  ) {}
  async createPipeline(
    createPipelineDto: CreatePipelineDto.Input,
  ): Promise<void> {
    const pipeline = plainToInstance(Pipeline, createPipelineDto);
    await this.pipelineRepository.save(pipeline);
  }

  async findAllPipeline(dto: FetchPipelineDto.Input): Promise<any> {
    const queryBuilder = this.pipelineRepository
      .createQueryBuilder("pipeline")
      .orderBy("pipeline.id", "DESC");

    if (dto.q) {
      queryBuilder.andWhere(
        "pipeline.name ilike :searchKey OR pipeline.status ilike :searchKey",
        {
          searchKey: `%${dto.q}%`,
        },
      );
    }

    return await paginate(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findPipelineById(id: number): Promise<Pipeline> {
    const pipeline = await this.pipelineRepository.findOne({
      where: { id },
    });

    if (!pipeline) {
      throw new NotFoundException("Pipeline not found");
    }
    return pipeline;
  }

  async updatePipelineById(
    id: number,
    updatePipelineDto: UpdatePipelineDto.Input,
  ): Promise<Pipeline> {
    const pipeline = await this.findPipelineById(id);
    const updatedPipeline = plainToInstance(Pipeline, {
      ...pipeline,
      ...updatePipelineDto,
    });
    await this.pipelineRepository.save(updatedPipeline);
    return updatedPipeline;
  }

  async removePipelineById(id: number) {
    const pipeline = await this.findPipelineById(id);

    if (!pipeline) {
      throw new NotFoundException("Pipeline not found");
    }

    await this.pipelineRepository.remove(pipeline);
  }
}
