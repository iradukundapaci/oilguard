import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "pipeline" })
export class Pipeline extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  status: string;

  @Column()
  lastInspectionDate: Date;

  @Column()
  pipeLineAge: number;
}
