import { Routes } from '@angular/router';
import {canActivateGuard} from './_guards/auth.guard';
import { DirectoryListComponent } from './_components/directory-list/directory-list.component';
import { DirectoryComponent } from './_components/directory/directory.component';
import { InteractionDetailsComponent } from './_components/interaction-details/interaction-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'directories', pathMatch: 'full' },
  { path: 'directories', component: DirectoryListComponent, canActivate: [canActivateGuard], },
  { path: 'directories/:id', component: DirectoryComponent, canActivate: [canActivateGuard], },
  { path: 'directories/:id/:interactionId', component: InteractionDetailsComponent, canActivate: [canActivateGuard], },
];
