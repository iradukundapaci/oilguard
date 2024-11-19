import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { Column, Entity } from "typeorm";

@Entity({ name: "pipeline" })
export class Pipeline extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  status: UserRole;

  @Column()
  lastInspectionDate: Date;

  @Column()
  pipeLineAge: number;
}
