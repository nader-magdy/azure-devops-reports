import { Controller, Get } from '@nestjs/common';
import { AzureDevopsService } from 'src/services/azure-devops.service';

@Controller('iteration')
export class IterationController {
    constructor(private readonly azureDevOpsService: AzureDevopsService) { }

  @Get("capacity")
  async getIterations(filterPath : string = "") {
    return this.azureDevOpsService.getCapacity(filterPath);
  }

  //teamdaysoff
  @Get("team-days-off")
  async getTeamDaysOff() {
    return this.azureDevOpsService.getTeamDaysOff();
  }
}
