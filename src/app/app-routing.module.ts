import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationsComponent } from './reservations/reservations.component';
import { InventoryComponent } from './inventory/inventory.component';

const routes: Routes = [{
  path: '',
  component: ReservationsComponent
},
{
  path: 'reservations',
  component: ReservationsComponent
},
{
  path: 'inventory',
  component: InventoryComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
