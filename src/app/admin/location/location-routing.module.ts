import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllRoomComponent } from './all-room/all-room.component';
import { AllVenueComponent } from './all-venue/all-venue.component';
import { EditRoomComponent } from './edit-room/edit-room.component';
import { EditVenueComponent } from './edit-venue/edit-venue.component';
import { NewRoomComponent } from './new-room/new-room.component';
import { NewVenueComponent } from './new-venue/new-venue.component';
const routes: Routes = [
  {
    path: 'all-venue',
    component: AllVenueComponent
  },
  {
    path: 'new-venue',
    component: NewVenueComponent
  },
  {
    path: 'edit-venue/:id',
    component: EditVenueComponent
  },
  {
    path: 'all-room',
    component: AllRoomComponent
  },
  {
    path: 'new-room',
    component: NewRoomComponent
  },
  {
    path: 'edit-room/:id',
    component: EditRoomComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
