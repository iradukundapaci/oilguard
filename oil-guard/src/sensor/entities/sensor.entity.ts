import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Pipeline } from "../../pipeline/entities/pipeline.entity";

@Entity("sensor")
export class Sensor extends AbstractEntity {
  @ManyToOne(() => Pipeline, (pipeline) => pipeline.id)
  pipeline: Pipeline;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column({ default: false })
  online: boolean;
}
