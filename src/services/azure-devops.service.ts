import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map, Observable } from 'rxjs';
import { IAzureDevOpsConfig } from 'src/configs/azure-devops-config';
import { ICapacity } from 'src/models/capacity.model';
import { IDaysOff } from 'src/models/days-off.model';
import { IIteration } from 'src/models/iteration.model';
import { ConfigService } from './config.service';

@Injectable()
export class AzureDevopsService {

    constructor(private readonly httpService: HttpService,
        private readonly configService: ConfigService) { }

    async getCapacity(filterPath: string = "", filter : IAzureDevOpsConfig = null): Promise<ICapacity[]> {
        const currentIteration = await this.getCurrentIteration(filterPath, filter);
        return this.getCapacityPerIteration(currentIteration, filter);

    }

    private async getCapacityPerIteration(iteration: IIteration, filter : IAzureDevOpsConfig = null): Promise<ICapacity[]> {
        const teamDaysOff = await this.getTeamDaysOff(iteration.id, filter);
        let teamDaysOffCount = 0;
        teamDaysOff.forEach(daysOff => {
            teamDaysOffCount += this.getBusinessDatesCount(daysOff.start, daysOff.end);
        })
        return lastValueFrom(this.httpService.get(this.buildBasicUrl(`teamsettings/iterations/${iteration.id}/capacities`, filter))
            .pipe(map(res => res.data.value.map(c => {
                let obj = <ICapacity>{
                    ...c.teamMember,
                    ...c.activities[0],
                    daysOff: teamDaysOffCount,
                    workingHours: 8,
                    workingDays: this.getBusinessDatesCount(iteration.startDate, iteration.finishDate),
                    iterationName: iteration.name,
                    iterationPath: iteration.path,
                    iterationUrl: iteration.url,
                    iterationStartDate: iteration.startDate,
                    iterationFinishDate: iteration.finishDate,
                    iterationTimeFrame: iteration.timeFrame
                };
                c.daysOff.forEach(dayOff => {
                    obj.daysOff += this.getBusinessDatesCount(dayOff.start, dayOff.end);
                });

                return obj;
            }))));
    }

    getIterations(filterPath: string = "", filter : IAzureDevOpsConfig = null): Observable<IIteration[]> {
        const team = filter?.team || this.configService.azureDevOpsConfigs.team;
        return this.httpService.get(this.buildBasicUrl("teamsettings/iterations", filter))
            .pipe(
                map(res => 
                    res.data.value.filter(x => x.path.indexOf(`${team}\\${filterPath}`) > -1)
                    .map(iteration => (<IIteration>{
                        id: iteration.id,
                        name: iteration.name,
                        path: iteration.path.replace(this.configService.azureDevOpsConfigs.team, ""),
                        url: iteration.url,
                        ...iteration.attributes
                    }))));
    }

    async getTeamDaysOff(iterationId: string = null, filter : IAzureDevOpsConfig = null): Promise<IDaysOff[]> {
        iterationId = iterationId ?? (await this.getCurrentIteration()).id;
        return lastValueFrom(this.httpService.get(this.buildBasicUrl(`teamsettings/iterations/${iterationId}/teamdaysoff`, filter))
            .pipe(map(res => <IDaysOff[]>res.data.daysOff)));
    }
    private async getCurrentIteration(filterPath: string = "", filter : IAzureDevOpsConfig = null): Promise<IIteration> {
        let iterations$ = this.getIterations(filterPath, filter);
        let iterations = await lastValueFrom(iterations$);
        return iterations.filter(i => i.timeFrame == 'current')[0];
    }
    private buildBasicUrl(endpoint: string, filter : IAzureDevOpsConfig = null): string {
        const project = filter?.project || this.configService.azureDevOpsConfigs.project;
        const team = filter?.team || this.configService.azureDevOpsConfigs.team;
        return `https://${this.configService.azureDevOpsConfigs.token}@projects.integrant.com/${this.configService.azureDevOpsConfigs.organization}/${project}/${team}/_apis/work/${endpoint}`;
    }

    private getBusinessDatesCount(startDate: Date, endDate: Date) {
        startDate = new Date(startDate)
        endDate = new Date(endDate)
        let count = 0;
        let startTime = startDate.getTime();
        let endTime = endDate.getTime();
        while (startTime <= endTime) {
            const dayOfWeek = new Date(startTime).getDay();
            const isWeekend = (dayOfWeek === 6) || (dayOfWeek === 5);
            if (!isWeekend) {
                count++;
            }
            startTime = startTime + 24 * 60 * 60 * 1000
        }
        return count;
    }
}
