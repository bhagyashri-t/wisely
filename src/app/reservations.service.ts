import { Injectable } from '@angular/core';
import { TimeSlotsWithCapacity } from './interfaces/TimeSlotsWithCapacity';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  inventory: [] = JSON.parse(sessionStorage.getItem('inventory')) || [];
  getUrl: string = 'http://localhost:8888/inventory';
  updateInventoryUrl: string = 'http://localhost:8888/inventory';
  updateBulkInventoryUrl: string = 'http://localhost:8888/updateInventory';

  constructor( private http: HttpClient ) { }

  getInventory():Observable<any> {
    return this.http.get(this.getUrl);
  }
  updateInventory(id: number, payload: Object):Observable<any> {
    let url = this.updateInventoryUrl + '/' + id;
    return this.http.put(url, payload);
  }
  updateBulkInventory(payload: Object):Observable<any> {
    return this.http.put(this.updateBulkInventoryUrl, payload);
  }
}
