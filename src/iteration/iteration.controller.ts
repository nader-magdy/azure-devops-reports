import { Controller, Get, Param, Query } from '@nestjs/common';
import { IAzureDevOpsConfig } from 'src/configs/azure-devops-config';
import { AzureDevopsService } from 'src/services/azure-devops.service';

@Controller('iteration')
export class IterationController {
  constructor(private readonly azureDevOpsService: AzureDevopsService) { }

  @Get('capacity/:project/:team')
  async getIterations(@Param('project') project: string, @Param('team') team: string,@Query("f") filterPath : string = "") {
    return this.azureDevOpsService.getCapacity(filterPath, <IAzureDevOpsConfig>{ project, team });
  }

  //teamdaysoff
  @Get("team-days-off")
  async getTeamDaysOff() {
    return this.azureDevOpsService.getTeamDaysOff();
  }
}
