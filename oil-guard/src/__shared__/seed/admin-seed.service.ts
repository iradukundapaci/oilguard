import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PasswordEncryption } from "src/auth/utils/password-encrytion.util";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { IAppConfig } from "src/__shared__/interfaces/app-config.interface";
import { Pipeline } from "src/pipeline/entities/pipeline.entity";
import { Sensor } from "src/sensor/entities/sensor.entity";

@Injectable()
export class AdminSeedService {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Pipeline)
    private readonly pipelineRepository: Repository<Pipeline>,
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
    public configService: ConfigService<IAppConfig>,
  ) {}

  async run() {
    const backdoor = this.configService.get("backdoor");
    const email = backdoor?.username;
    const adminPassword = backdoor?.password;

    // 1. Backdoor admin creation
    if (email && adminPassword) {
      if (backdoor?.enabled === false) {
        this.logger.warn("Backdoor admin creation is disabled");
        return;
      }

      const adminExist = await this.userRepository.existsBy({ email });

      if (!adminExist) {
        const password = PasswordEncryption.hashPassword(adminPassword);
        const user = {
          email,
          names: "BACKDOOR ADMIN",
          password,
          role: UserRole.ADMIN,
          refreshToken: "",
          verifiedAt: new Date(),
          activated: true,
        };
        await this.userRepository.save(user);
        this.logger.log("Backdoor admin created successfully");
      } else {
        this.logger.log("Backdoor admin already exists");
      }
    } else {
      this.logger.warn(
        "Backdoor admin credentials not found in the environment variables",
      );
    }

    // 2. Pipeline and Sensor creation (runs unconditionally)
    const existingPipeline = await this.pipelineRepository.findOne({
      where: { name: "Pipeline1" },
    });

    if (!existingPipeline) {
      const pipe = new Pipeline();
      pipe.name = "Pipeline1";
      pipe.status = "OPEN";
      pipe.lastInspectionDate = new Date();
      pipe.pipeLineAge = 0;
      await this.pipelineRepository.save(pipe);
      this.logger.log("Pipeline1 created successfully");

      // Create sensors for the pipeline
      const sensors = [
        { latitude: "3214213532", longitude: "1233241", online: true },
        { latitude: "3214213532", longitude: "1233241", online: true },
        { latitude: "3214213532", longitude: "1233241", online: true },
        { latitude: "3214213532", longitude: "1233241", online: true },
      ];

      for (const sensorData of sensors) {
        const sensor = new Sensor();
        sensor.pipeline = pipe;
        sensor.latitude = sensorData.latitude;
        sensor.longitude = sensorData.longitude;
        sensor.online = sensorData.online;
        await this.sensorRepository.save(sensor);
      }

      this.logger.log("Sensors for Pipeline1 created successfully");
    } else {
      this.logger.log("Pipeline1 already exists");
    }
  }
}
