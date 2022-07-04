import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AzureDevopsService } from './services/azure-devops.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly azureDevOpsService: AzureDevopsService) { }

  @Get("iterations")
  async getIterations() {
    return this.azureDevOpsService.getIterations();
  }
}
