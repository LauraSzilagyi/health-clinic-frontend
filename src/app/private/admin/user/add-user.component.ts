import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../api.service";
import {Doctor} from "../../../models/doctor";
import {Language} from "../../../models/language";
import {DoctorAvailability} from "../../../models/doctor-availability";

enum UserOperation {
  ADD = "Create a new doctor",
  UPDATE = "Update doctor"
}

@Component({
  selector: 'app-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  doctorId!: number;
  doctor: Doctor = new Doctor();
  userOperation!: UserOperation;
  imageSrc!: string | ArrayBuffer | null;
  departments: string[] = []
  weekdays: string[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
  hours: string[] = [
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.getDepartments()
    this.getDoctorIdFromPath();

    this.userOperation = this.getOperation();
    this.addSaveButtonAction()
    if (this.userOperation == UserOperation.ADD) {
    } else {
      this.getDoctorData(this.doctorId);
    }
  }

  ngAfterViewInit() {

  }

  private getDepartments() {
    this.apiService.getDepartments()
      .subscribe((data: string[]) => {
        this.departments = data;
      })
  }

  readURL(event: Event): void {
    // @ts-ignore
    if (event.target.files && event.target.files[0]) {
      // @ts-ignore
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);
    }
  }

  private addSaveButtonAction() {
    let button = (document.getElementById('save-button') as HTMLButtonElement)
    if (this.userOperation === UserOperation.ADD) {
      button.addEventListener('click', this.addDoctor.bind(this));
    } else {
      button.addEventListener('click', this.updateDoctor.bind(this));
    }
  }

  public addDoctor() {
    this.updateDoctorObjectFromInputs();
    this.doAdd(this.doctor);
    this.showNotificationPanel();
  }

  private showNotificationPanel() {
    let notification = (document.getElementById('notification') as HTMLElement)
    notification.classList.add('show')
    let interval = setInterval(() => {
      notification.classList.remove('show')
      clearInterval(interval);
    }, 2000);
  }

  public updateDoctor() {
    this.updateDoctorObjectFromInputs();
    this.doUpdate(this.doctorId, this.doctor)
    this.showNotificationPanel();
    this.postAvailabilities();
  }

  private getDoctorIdFromPath() {
    this.activatedRoute.url.subscribe(s => {
      this.doctorId = Number(s[1])
    })
  }


  private getOperation(): UserOperation {
    if (isNaN(this.doctorId)) {
      return UserOperation.ADD;
    } else {
      return UserOperation.UPDATE;
    }
  }

  private getDoctorData(doctorId: number) {
    this.apiService.getDoctorById(doctorId)
      .subscribe(value => {
        this.doctor = value;
        this.setDepartmentSelectedValue()
        this.setAvailabilityFromDoctorData(value);
      })
  }

  mapToString() {
    return function (p1: Language, p2: number, p3: Language[]) {
      return p1.language
    };

  }

  private updateDoctorObjectFromInputs() {
    let name = (document.getElementById('doctorName') as HTMLInputElement),
      email1 = (document.getElementById('emailInput1') as HTMLInputElement),
      email2 = (document.getElementById('emailInput2') as HTMLInputElement),
      passwordInput1 = (document.getElementById('passwordInput1') as HTMLInputElement),
      passwordInput2 = (document.getElementById('passwordInput2') as HTMLInputElement),
      phone = (document.getElementById('phoneInput') as HTMLInputElement),
      address = (document.getElementById('addressInput') as HTMLInputElement),
      department = (document.getElementById('department-select') as HTMLInputElement),
      specialist = (document.getElementById('specialistInput') as HTMLInputElement),
      experience = (document.getElementById('experienceInput') as HTMLInputElement),
      language = (document.getElementById('languageInput') as HTMLInputElement),
      birthdate = (document.getElementById('birthdateInput') as HTMLInputElement),
      description = (document.getElementById('descriptionInput') as HTMLInputElement);
    if (this.imageSrc !== undefined) {
      this.doctor.image = this.imageSrc;

    }

    this.doctor.name = name.value
    if (email1.value == email2.value) {
      this.doctor.email = email1.value
    }
    if (passwordInput1.value == passwordInput2.value) {
      this.doctor.password = passwordInput1.value
    }
    this.doctor.phone = phone.value
    this.doctor.address = address.value
    this.doctor.department = department.value
    this.doctor.specialist = specialist.value
    this.doctor.experience = Number(experience.value)
    this.doctor.description = description.value
    this.doctor.birthdate = birthdate.value
  }

  private doUpdate(doctorId: number, doctor: Doctor) {
    this.apiService.updateDoctorById(doctorId, doctor).subscribe()
  }

  private doAdd(doctor: Doctor) {
    this.apiService.addDoctor(doctor).subscribe();
  }

  private setDepartmentSelectedValue() {
    let departments = (document.getElementById('department-select') as HTMLSelectElement)
    for (let i = 0; i < departments.options.length; i++) {
      let department = <HTMLOptionElement>departments[i];
      if (department.label == this.doctor.department) {
        department.selected = true
      }
    }
  }


  private setAvailabilityFromDoctorData(doctor: Doctor) {
    let availabilities = doctor.availabilities;
    availabilities.forEach(availability => {
      this.setAvailabilitySelectDefaultValue(availability, availability.startTime, 'start');
      this.setAvailabilitySelectDefaultValue(availability, availability.endTime, 'end');
    })
  }

  private setAvailabilitySelectDefaultValue(availability: DoctorAvailability, startTime: string, type: string) {
    let startSelector = (document.getElementById(`${availability.day}-availability-${type}`) as HTMLSelectElement)
    let weekCheckbox = (document.getElementById(`${availability.day}-checkbox`) as HTMLInputElement)
    weekCheckbox.checked = true

    let options = startSelector.options;
    for (let optionIndex in options) {
      let option = (<HTMLOptionElement>options[optionIndex])
      if (option.label == startTime) {
        option.selected = true
      }
    }
  }

  private postAvailabilities() {
    let availabilitiesToAdd: DoctorAvailability[] = [];
    this.weekdays.forEach(weekday => {
      let weekCheckbox = (document.getElementById(`${weekday}-checkbox`) as HTMLInputElement)
      let startTime = (document.getElementById(`${weekday}-availability-start`) as HTMLSelectElement)
      let endTime = (document.getElementById(`${weekday}-availability-end`) as HTMLSelectElement)

      if (weekCheckbox.checked && startTime.value != '0' && endTime.value != '0') {
        let doctorAvailability = new DoctorAvailability();
        doctorAvailability.day = weekday;
        doctorAvailability.startTime = startTime.value
        doctorAvailability.endTime = endTime.value

        availabilitiesToAdd.push(doctorAvailability)
      }

    })

    this.apiService.addDoctorAvailabilities(this.doctorId, availabilitiesToAdd).subscribe();
  }
}
