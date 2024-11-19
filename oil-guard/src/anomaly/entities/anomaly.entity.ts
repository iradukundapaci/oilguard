import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Pipeline } from "src/pipeline/entities/pipeline.entity";

@Entity()
export class Anomaly extends AbstractEntity {
  @ManyToOne(() => Pipeline, (pipeline) => pipeline.id)
  pipeline: Pipeline;

  @Column({ type: "timestamp" })
  detectedAt: string;

  @Column()
  severity: string;

  @Column()
  predictionModel: string;

  @Column()
  status: string;
}
