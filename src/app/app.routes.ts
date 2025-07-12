import { Routes } from '@angular/router';
import { UserDetails } from './components/user-details/user-details';
import { UserList } from './components/user-list/user-list';

export const routes: Routes = [
  { path: '', component: UserList },
  { path: 'user/:id', component: UserDetails },
];
