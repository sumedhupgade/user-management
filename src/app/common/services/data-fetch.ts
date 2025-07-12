import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataFetch {
  private http = inject(HttpClient);
  private usersSignal = signal<User[]>([]);
  users = computed(() => this.usersSignal());

  fetchUsers() {
    this.http
      .get<User[]>('https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json')
      .subscribe((data) => this.usersSignal.set(data));
  }

  getUser(index: number): User | null {
    return this.usersSignal()?.[index] ?? null;
  }
}
