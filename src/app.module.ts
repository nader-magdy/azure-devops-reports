import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './services/config.service';
import { AzureDevopsService } from './services/azure-devops.service';
import { IterationController } from './iteration/iteration.controller';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController, IterationController],
  providers: [AppService, ConfigService, AzureDevopsService],
})
export class AppModule {}
