import { IIteration } from "./iteration.model";

export interface ICapacity extends IIteration {
    displayName: string;
    url: string;
    id: string;
    uniqueName: string;
    imageUrl: string;
    descriptor: string;
    capacityPerDay: number;
    name: string;
    daysOff: number;
    workingHours: number;
    workingDays: number;
    iterationName : string;
    iterationPath : string;
    iterationUrl : string;
    iterationStartDate : Date;
    iterationFinishDate : Date;
    iterationTimeFrame : string;
}