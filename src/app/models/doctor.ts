import {Language} from "./language";
import {DoctorAvailability} from "./doctor-availability";

export class Doctor {
  id!: number;
  name!: string;
  specialist!: string;
  description!: string;
  image!: string | ArrayBuffer | null;
  email!: string;
  password!: string;
  birthdate!: string;
  address!: string;
  phone!: string;
  department!: string;
  experience!: number;
  languages!: Language[];
  availabilities!: DoctorAvailability[];
}
