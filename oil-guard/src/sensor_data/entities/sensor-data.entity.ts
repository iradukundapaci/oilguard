import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Sensor } from "src/sensor/entities/sensor.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class SensorData extends AbstractEntity {
  @ManyToOne(() => Sensor, (sensor) => sensor.id)
  sensor: Sensor;

  @Column("double precision")
  avgInflow: number;

  @Column("double precision")
  avgOutflow: number;

  @Column("double precision")
  pressure: number;

  @Column("double precision")
  flowRate: number;

  @Column("double precision")
  vibration: number;

  @Column("double precision")
  temperature: number;

  @Column("double precision")
  humidity: number;

  @Column("double precision")
  precipitation: number;

  @Column({ type: "timestamp" })
  timestamp: Date;
}
