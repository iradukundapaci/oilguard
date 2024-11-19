import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Entity, Column } from "typeorm";
import { UserRole } from "src/__shared__/enums/user-role.enum";

@Entity("users")
export class User extends AbstractEntity {
  @Column()
  names: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
