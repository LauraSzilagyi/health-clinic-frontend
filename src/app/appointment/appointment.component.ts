import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {Doctor} from "../models/doctor";
import {AvailabilityModel} from "../models/doctor/availability-model";
import {PeriodModel} from "../models/doctor/period-model";
import {AddAppointment} from "../models/add-appointment";

declare var $: any;


declare var loadDatepicker: (minDate: Date, maxDate: Date, dates: Date[]) => void;
declare var removeDatePicker: () => void;

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  @Input() blueBackground: boolean | string = false;
  departments: string[] = []
  doctors: Doctor[] = []
  datesWhereScheduleIsNotPermitted: Date[] = []
  availability: AvailabilityModel[] = []
  freeAppointments: string[] = [];
  pendingAppointmentRequest: boolean = false;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.setAppointmentPageColors();

    this.getDepartments();
  }

  private getDepartments() {
    this.apiService.getDepartments()
      .subscribe((data: string[]) => {
        this.departments = data;
      })
  }

  ngAfterContentInit(): void {

  }

  private setAppointmentPageColors() {
    if (this.blueBackground) {
      this.setBlueColor();
    } else {
      this.setDefaultColor();
    }
  }

  private addClassToClasses(listOfClasses: any, classToAdd: string) {
    for (let i = listOfClasses.length - 1; i >= 0; i--) {
      this.addClassToClass(listOfClasses[i], classToAdd);
    }
  }

  addClassToClass(classWhereToAdd: any, classToAdd: string) {
    classWhereToAdd.classList.add(classToAdd);
  }

  setBlueColor() {
    let c = (document.getElementById("appointment-background") as HTMLElement)
    let a = (document.getElementById("appointment-text") as HTMLElement)
    let ac = (document.getElementById("appointment-container") as HTMLElement)
    let inputs = (document.getElementsByClassName("form-select"))
    let formControls = (document.getElementsByClassName("form-control"))
    this.addClassToClasses(inputs, 'bg-light');
    this.addClassToClasses(formControls, 'bg-light');
    this.addClassToClass(c, 'bg-primary')
    this.addClassToClass(a, 'text-white')
    this.addClassToClass(ac, 'bg-white')
  }

  setDefaultColor() {
    let a = (document.getElementById("appointment-text") as HTMLElement)
    let ac = (document.getElementById("appointment-container") as HTMLElement)
    let inputs = (document.getElementsByClassName("form-select"))
    let formControls = (document.getElementsByClassName("form-control"))
    this.addClassToClasses(inputs, 'bg-white');
    this.addClassToClasses(formControls, 'bg-white');
    this.addClassToClass(a, 'text-primary')
    this.addClassToClass(ac, 'bg-light')
  }

  public departmentChanged(event: any) {
    let selectedDepartment = event.target.value;

    this.disableAppointmentButton();
    this.disableDateSelect();
    this.disableHourSelect()

    if (selectedDepartment != "Choose Department") {
      this.getDoctorsByDepartment(selectedDepartment);
      this.enableDoctorSelect();
    } else {
      this.removeAutoFilledContent();
      this.disableDoctorSelect();
    }
  }

  private enableDoctorSelect() {
    let doctorSelect = (document.getElementById('doctor-select') as HTMLInputElement);
    doctorSelect.disabled = false
    doctorSelect.classList.remove('disabled-input')
  }

  private disableDoctorSelect() {
    let doctorSelect = (document.getElementById('doctor-select') as HTMLInputElement);
    doctorSelect.disabled = true
    doctorSelect.classList.add('disabled-input')
  }

  private getDoctorsByDepartment(selectedDepartment: string) {
    this.apiService.getDoctorsByDepartment(selectedDepartment)
      .subscribe((data: Doctor[]) => {
        this.doctors = data
      })
  }

  private removeAutoFilledContent() {
    this.doctors = [];
  }

  public doctorChanged(event: any) {
    let selectedDoctor = event.target.value

    this.disableAppointmentButton();
    this.disableHourSelect();

    if (selectedDoctor != "Select Doctor") {
      removeDatePicker()
      this.getDoctorAvailabilities(selectedDoctor);
      this.setDefaultValueForDateInput();
      this.enableDateSelect();
    } else {
      this.disableDateSelect();
    }
  }

  private setDefaultValueForDateInput() {
    let doctorChange = (document.getElementById('appointment-date') as HTMLInputElement);
    doctorChange.value = "SELECT DATE"
  }

  private enableDateSelect() {
    let dateSelect = (document.getElementById('appointment-date') as HTMLInputElement);
    dateSelect.disabled = false;
    dateSelect.classList.remove('disabled-input')
  }

  private disableDateSelect() {
    // removeDatePicker();
    let dateSelect = (document.getElementById('appointment-date') as HTMLInputElement);
    dateSelect.disabled = true;
    dateSelect.classList.add('disabled-input');
    dateSelect.value = "SELECT DATE";
  }

  public dateChanged() {
    let dateInput = (document.getElementById('appointment-date') as HTMLInputElement);
    let availability = this.findAvailabilityByDate(dateInput.value);

    this.calculateAvailableHours(availability);

    this.disableAppointmentButton();
    this.enableHourSelect();
  }

  private disableHourSelect() {
    let hourSelect = (document.getElementById('hour-select') as HTMLInputElement);
    hourSelect.disabled = true;
    hourSelect.classList.add('disabled-input')
    hourSelect.value = "Choose Hour"
  }

  private enableHourSelect() {
    let hourSelect = (document.getElementById('hour-select') as HTMLInputElement);
    hourSelect.disabled = false;
    hourSelect.classList.remove('disabled-input')
  }

  private calculateAvailableHours(availability: AvailabilityModel) {
    let start = availability.openInterval?.start;
    let end = availability.openInterval?.end;

    let startDate = new Date(2022, 1, 1, this.getHour(start), this.getMinutes(start));
    let endDate = new Date(2022, 1, 1, this.getHour(end), this.getMinutes(end));

    let possibleTimes: string[] = []

    let index = 0;
    let currentTimeOption = startDate

    while (currentTimeOption.getHours() != endDate.getHours()
    || currentTimeOption.getMinutes() != endDate.getMinutes()) {
      index++;
      possibleTimes.push(this.createTimeFormat(currentTimeOption))
      currentTimeOption.setMinutes(currentTimeOption.getMinutes() + 30)
    }

    this.freeAppointments = this.removeAlreadyActiveAppointments(possibleTimes, availability);
  }

  private createTimeFormat(currentTimeOption: Date) {
    if (currentTimeOption.getMinutes() == 0) {
      return currentTimeOption.getHours().toString() + ":" + currentTimeOption.getMinutes().toString() + "0";
    } else {
      return currentTimeOption.getHours().toString() + ":" + currentTimeOption.getMinutes().toString();
    }
  }

  private getMinutes(date: string | undefined) {
    // @ts-ignore
    return Number(date.split(":")[1]);
  }

  private getHour(date: string | undefined) {
    // @ts-ignore
    return Number(date.split(":")[0]);
  }

  private findAvailabilityByDate(date: string): AvailabilityModel {
    let foundAvailability: AvailabilityModel;
    this.availability.forEach(a => {
      let availabilityDate = Date.parse(a.date);
      let chosenDate = Date.parse(date);
      if (availabilityDate == chosenDate) {
        foundAvailability = a;
      }
    })
    // @ts-ignore
    return foundAvailability;
  }


  private getDoctorAvailabilities(selectedDoctor: number) {
    this.datesWhereScheduleIsNotPermitted = []
    this.datesWhereScheduleIsNotPermitted.push(new Date());

    this.apiService.getDoctorAvailabilityByDoctorId(selectedDoctor)
      .subscribe((data: AvailabilityModel[]) => {
        this.availability = data

        data.forEach(value => {
          let totalWorkingHours = this.getWorkingHours(value);
          if (this.isDayFullWithSchedules(value.bookedSchedules, totalWorkingHours)) {
            this.datesWhereScheduleIsNotPermitted.push(new Date(value.date))
          } else if (isNaN(totalWorkingHours)) {
            this.datesWhereScheduleIsNotPermitted.push(new Date(value.date))
          } else {
          }
        })


        let endDate = new Date()
        endDate.setDate(endDate.getDate() + 25)
        loadDatepicker(new Date(), endDate, this.datesWhereScheduleIsNotPermitted)

        this.addCalendarButtonEvent();
      })
  }

  private addCalendarButtonEvent() {
    let dateButtons = (document.getElementsByClassName('mc-btn'));
    for (let i = 0; i < dateButtons.length; i++) {
      let dateButton = <HTMLInputElement>dateButtons[i];
      if (dateButton.id === "mc-btn__ok") {
        dateButton?.addEventListener("click", this.dateChanged.bind(this));
      }
    }
  }

  private isDayFullWithSchedules(bookedSchedules: PeriodModel[] | undefined, workingHours: number) {
    return (workingHours * 2) == bookedSchedules?.length
  }

  private getWorkingHours(value: AvailabilityModel): number {
    const timeStart = new Date("01/01/2007 " + value.openInterval?.start).getHours();
    const timeEnd = new Date("01/01/2007 " + value.openInterval?.end).getHours();
    return timeEnd - timeStart;
  }


  private removeAlreadyActiveAppointments(possibleTimes: string[], availability: AvailabilityModel): string[] {
    let freeTimeForAppointments: string[] = [];
    possibleTimes.forEach(date => {
      function dateIsNotScheduled(date: string, bookedSchedules: PeriodModel[] | undefined) {
        let isScheduled = false;
        bookedSchedules?.forEach(value => {
          if (value.start == date) {
            isScheduled = true;
          }
        })
        return !isScheduled;
      }

      if (dateIsNotScheduled(date, availability.bookedSchedules)) {
        freeTimeForAppointments.push(date)
      }
    })

    return freeTimeForAppointments;
  }

  public hourChanged() {
    this.enableAppointmentButton();
  }

  private disableAppointmentButton() {
    let appointmentButton = (document.getElementById('appointment-button') as HTMLButtonElement)
    appointmentButton.disabled = true;
  }

  private enableAppointmentButton() {
    let appointmentButton = (document.getElementById('appointment-button') as HTMLButtonElement)
    appointmentButton.disabled = false;
  }

  private showNotificationPanel() {
    let notification = (document.getElementById('notification') as HTMLElement)
    notification.classList.add('show')
    let interval = setInterval(() => {
      notification.classList.remove('show')
      clearInterval(interval);
      window.location.reload();
    }, 8000);
  }

  public sendAppointmentData() {
    if (this.pendingAppointmentRequest) {
      return;
    }

    let department = (document.getElementById('department-select') as HTMLInputElement);
    let doctor = (document.getElementById('doctor-select') as HTMLInputElement);
    let name = (document.getElementById('name-input') as HTMLInputElement);
    let email = (document.getElementById('email-input') as HTMLInputElement);
    let date = (document.getElementById('appointment-date') as HTMLInputElement);
    let hour = (document.getElementById('hour-select') as HTMLInputElement);

    let addAppointment = new AddAppointment();

    addAppointment.department = department.value
    addAppointment.doctorId = Number(doctor.value)
    addAppointment.name = name.value
    addAppointment.email = email.value
    addAppointment.date = date.value
    addAppointment.time = hour.value

    this.pendingAppointmentRequest = true
    this.apiService.addAppointment(addAppointment).subscribe(value => {
      if (value.status == 'success') {
        this.showNotificationPanel()
      }
    })
  }
}
