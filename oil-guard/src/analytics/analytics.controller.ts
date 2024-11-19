import { Controller } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { GetOperation } from "src/__shared__/decorators";
import { ApiTags } from "@nestjs/swagger";

@Controller("analytics")
@ApiTags("Analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @GetOperation("", "Get all analytics")
  async findAll() {
    return await this.analyticsService.getAnalytics();
  }
}
