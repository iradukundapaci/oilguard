export namespace AnalyticsDto {
  export interface OutPut {
    pipelines: number;
    sensors: {
      total: number;
      online: number;
      offline: number;
    };
    anomalies: number;
    anomaliesGroupedBySeverity: Array<{ severity: string; count: number }>;
    reports: number;
    reportsGroupedByStatus: Array<{ status: string; count: number }>;
    notifications: number;
    pipelinesGroupedByStatus: Array<{ status: string; count: number }>;
  }
}
