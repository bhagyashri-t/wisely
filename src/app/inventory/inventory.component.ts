import { Component, OnInit } from '@angular/core';
import { ReservationsService } from '../reservations.service';
import { TimeSlotsWithCapacity, Minutes } from '../interfaces/TimeSlotsWithCapacity';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  displayColumns: string[] = ['hour', 'm00', 'm15', 'm30', 'm45', 'hourTotal'];
  minutes: string[] = [];
  data = this.reservationService.inventory;
  selectedFromHour: number = 0;
  selectedToHour: number = 0;
  toHoursList: TimeSlotsWithCapacity[] = [];
  unableUpdate: boolean = false;
  enableToHour: boolean = false;
  bookings: string = '';

  constructor( private reservationService: ReservationsService ) { 
  }

  ngOnInit(): void {
    console.log( "inventory component : ", this.reservationService.inventory);
  }

  updateBooking(event: any, hour: number) {
    let minute = event.target.name;
    let index = this.getHourIndex(hour);
    let value = Number(event.target.value);
    this.data[index].minutes[minute] = value;
    this.data[index].hourTotal = this.getHourTotal(this.data[index]);
    this.reservationService.updateInventory(hour, this.data[index]).subscribe((res)=> {

      console.log("Updated inventory:  ", this.reservationService.inventory);
    });
  }

  getHourTotal(hourData: any) {
    return Number(hourData.minutes.m00) + Number(hourData.minutes.m15) + Number(hourData.minutes.m30) + Number(hourData.minutes.m45);
  }
  updateBookingsBetweenHours() {
    let start = this.getHourIndex(this.selectedFromHour);
    let end  = this.getHourIndex(this.selectedToHour);

    for(let i = start; i <= end; i++) {
      let hourData = this.data[i];
      for(let key in hourData.minutes) {
        if(key !== 'hour') {
          this.data[i].minutes[key as keyof Minutes] = Number(this.bookings);
        }
      }
      this.data[i].hourTotal = Number(this.bookings) * 4;
    }
    let array = this.data.slice(start, end-start+1);
    console.log("array  :", array);
    let payload = {data: array}
    this.reservationService.updateBulkInventory(payload).subscribe((res)=> {
        console.log("Updated inventory: ", res);
    });
  }

  fromHourSelected(event : any) {
    console.log("fromHourSelected");
    if(this.selectedFromHour > 0) {
      let index = this.getHourIndex(this.selectedFromHour);
      this.toHoursList = this.data.slice(index+1);
      console.log("toHourList", this.toHoursList);
      this.enableToHour = true;
    }
  }

  getHourIndex(hour: number) {
    let index = this.data.findIndex((el) => {
      return el.hour == hour;
    });
    return index;
  }

}
