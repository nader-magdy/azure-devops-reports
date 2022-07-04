import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AzureDevopsService } from './services/azure-devops.service';
import { IterationController } from './iteration/iteration.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController, IterationController],
  providers: [AppService, AzureDevopsService],
})
export class AppModule {}
