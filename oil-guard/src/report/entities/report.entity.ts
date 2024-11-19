import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Pipeline } from "src/pipeline/entities/pipeline.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Reports extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Pipeline, (pipeline) => pipeline.id)
  pipeline: Pipeline;

  @Column("text")
  description: string;

  @Column()
  status: string;
}
