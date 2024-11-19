import { Injectable } from "@nestjs/common";
import { Anomaly } from "src/anomaly/entities/anomaly.entity";
import { Notifications } from "src/notifications/entities/notification.entity";
import { Pipeline } from "src/pipeline/entities/pipeline.entity";
import { Reports } from "src/report/entities/report.entity";
import { Sensor } from "src/sensor/entities/sensor.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class AnalyticsService {
  constructor(private readonly entityManager: EntityManager) {}

  async getAnalytics() {
    // Query counts for cards
    const [pipelines, sensors, anomalies, reports, notifications] =
      await Promise.all([
        this.entityManager.count(Pipeline),
        this.entityManager.count(Sensor),
        this.entityManager.count(Anomaly),
        this.entityManager.count(Reports),
        this.entityManager.count(Notifications, { where: { isRead: false } }), // Unread notifications
      ]);

    // Group anomalies by severity
    const anomaliesGroupedBySeverity = await this.entityManager.query(`
      SELECT severity, COUNT(*) AS count
      FROM anomaly
      GROUP BY severity
    `);

    // Group reports by status
    const reportsGroupedByStatus = await this.entityManager.query(`
      SELECT status, COUNT(*) AS count
      FROM reports
      GROUP BY status
    `);

    // Group sensors by online status
    const onlineSensors = await this.entityManager.count(Sensor, {
      where: { online: true },
    });
    const offlineSensors = await this.entityManager.count(Sensor, {
      where: { online: false },
    });

    // Group pipelines by status
    const pipelinesGroupedByStatus = await this.entityManager.query(`
      SELECT status, COUNT(*) AS count
      FROM pipeline
      GROUP BY status
    `);

    // Calculate averages for sensor data
    const sensorAverages = await this.entityManager.query(`
      SELECT 
        AVG("avgInflow") AS "avgInflow",
        AVG("avgOutflow") AS "avgOutflow",
        AVG("pressure") AS "avgPressure",
        AVG("flowRate") AS "avgFlowRate",
        AVG("temperature") AS "avgTemperature",
        AVG("humidity") AS "avgHumidity",
        AVG("precipitation") AS "avgPrecipitation"
      FROM "sensor_data"
    `);

    const averages = sensorAverages[0]; // Since it returns a single row

    return {
      pipelines,
      sensors: {
        total: sensors,
        online: onlineSensors,
        offline: offlineSensors,
        averages: {
          avgInflow: +averages.avgInflow || 0,
          avgOutflow: +averages.avgOutflow || 0,
          avgPressure: +averages.avgPressure || 0,
          avgFlowRate: +averages.avgFlowRate || 0,
          avgTemperature: +averages.avgTemperature || 0,
          avgHumidity: +averages.avgHumidity || 0,
          avgPrecipitation: +averages.avgPrecipitation || 0,
        },
      },
      anomalies,
      anomaliesGroupedBySeverity: anomaliesGroupedBySeverity.map((row) => ({
        severity: row.severity,
        count: +row.count,
      })),
      reports,
      reportsGroupedByStatus: reportsGroupedByStatus.map((row) => ({
        status: row.status,
        count: +row.count,
      })),
      notifications,
      pipelinesGroupedByStatus: pipelinesGroupedByStatus.map((row) => ({
        status: row.status,
        count: +row.count,
      })),
    };
  }
}
