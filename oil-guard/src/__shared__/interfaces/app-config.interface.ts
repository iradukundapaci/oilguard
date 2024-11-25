export interface IAppConfig {
  port?: number;
  database: IDatabaseConfig;
  env?: string;
  jwt?: JwtConfig;
  allowedOrigins?: string[];
  swaggerEnabled?: boolean;
  backdoor?: IBackdoorConfig;
  mqtt?: MqttConfig;
}

interface JwtConfig {
  secret: string;
  expiresIn: string | number;
}

interface IDatabaseConfig {
  username: string;
  database: string;
  password: string;
  host: string;
  port?: number;
}

interface IBackdoorConfig {
  enabled: boolean;
  username: string;
  password: string;
}

interface MqttConfig {
  host: string;
  port: string;
}
