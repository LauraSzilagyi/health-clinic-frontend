import {PeriodModel} from "./period-model";

export class AvailabilityModel {
  date: string = ""
  openInterval: PeriodModel | undefined
  bookedSchedules: PeriodModel[] | undefined
}
