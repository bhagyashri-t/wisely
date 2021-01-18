import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Minutes } from '../interfaces/TimeSlotsWithCapacity';
import { ReservationsService} from '../reservations.service';
 
@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  reservationsForm = new FormGroup({});
  bookingsData : any = {};
  capacityData = [];
  timeSlots: string[] = [];

  constructor(private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private reservationService: ReservationsService) {

    this.formValidator();

    this.reservationService.getInventory().subscribe((res)=> {
      this.reservationService.inventory = res;
      this.capacityData = this.reservationService.inventory;
      sessionStorage.setItem('inventory', JSON.stringify(res));
      let x = sessionStorage.getItem('inventory');
      console.log(" from session ", JSON.parse(x));
      console.log("inventory in header : ", this.reservationService.inventory)
    });  
  }

  ngOnInit(): void {
    this.setTimeSlots();
  }

  formValidator() {
    this.reservationsForm = this.fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(3)])],
      'email': ['', Validators.compose([Validators.required, Validators.pattern('')])],
      'partySize': ['', Validators.compose([Validators.required, Validators.max(500), Validators.min(3)])],
      'date': ['', Validators.compose([Validators.required])],
      'time': ['', Validators.compose([Validators.required])]
    });
  }

  bookAppointmnet() {
    console.log(this.reservationsForm.value);
    let formData = this.reservationsForm.value;
    let time = formData.time.split(':');
    let date = new Date(formData.date);

    let timeDetails = {month: (date.getMonth() + 1), day: date.getDate(), hour: time[0], minute: time[1]};
    console.log("month : ", timeDetails.month, "day : ", timeDetails.day);

    if(this.bookingsData[timeDetails.month]) {
      let month = this.bookingsData[timeDetails.month];

      if(month[timeDetails.day]) {
        let day = month[timeDetails.day];

        if(day[timeDetails.hour]) {
          let hour = day[timeDetails.hour];

          if(hour[timeDetails.minute]) {

            this.bookingsData[timeDetails.month][timeDetails.day][timeDetails.hour][timeDetails.minute]++;
            let minutes = hour[timeDetails.minute];
            this.updateTimeSlots( timeDetails.hour, timeDetails.minute, minutes);

          } else {
            this.bookingsData[timeDetails.month][timeDetails.day][timeDetails.hour][timeDetails.minute] = 1;
          }
        } else {
          this.bookingsData[timeDetails.month][timeDetails.day][timeDetails.hour] = this.getHourValue(timeDetails);
        }
      } else {
        this.bookingsData[timeDetails.month][timeDetails.day] = this.getDayValue(timeDetails);
      }
    } else {
      this.bookingsData[timeDetails.month] = this.getMonthValue(timeDetails);
    }

    // console.log("BookingsData : ", this.bookingsData);
      
    this._snackBar.open('Your booking is confirmed!', 'X', {
      duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  getMonthValue (timeDetails: any) : any {
    let dayObj : any= {}, day = timeDetails.day;

    dayObj[day] = this.getDayValue(timeDetails);
    return dayObj;
  }
  getDayValue(timeDetails: any) : Object {
    let dayObj: any = {}, hour = timeDetails.hour;
    dayObj[hour] = this.getHourValue(timeDetails);
    return dayObj;
  }
  getHourValue(timeDetails: any) : any {
    let hourObj : any = {}, minutes = timeDetails.minute;
    hourObj[minutes] = 1;
    return hourObj;
  }

  setTimeSlots() {
    this.timeSlots = [];
    for(let i = 0; i < this.capacityData.length; i++) {
      let time = '';
      let hour = this.capacityData[i].hour;
      let minutes = this.capacityData[i].minutes;
      time = this.capacityData[i].hour + ':';
      for(let key in minutes) {
        
        if(this.bookingsData[hour] && this.bookingsData[hour][key] >= minutes[key as keyof Minutes]) {
          continue;
        } else {
          time += key.substr(1);
          this.timeSlots.push(time);
          time = this.capacityData[i].hour + ':';
        }       
      }
    }
    // console.log(this.timeSlots);
  }

  updateTimeSlots(hour: number, minute: string, count: number) {
    let index = this.getHourIndex(hour);
    let minuteKey = 'm' + minute;
    let capacityCount = this.capacityData[index].minutes[minuteKey as keyof Minutes];
    console.log( "this.capacityData[index] : ", this.capacityData[index], "capacityCount : ", capacityCount);
    
    if(capacityCount <= count) {
      let i = this.timeSlots.indexOf(`${hour}:${minute}`);
      this.timeSlots.splice(i, 1);
    }
  }

  getHourIndex(hour: number) {
    let index = this.capacityData.findIndex((el) => {
      return el.hour == hour;
    });
    return index;
  }

}
