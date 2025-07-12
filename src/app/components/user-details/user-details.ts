import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DataFetch } from '../../common/services/data-fetch';
import type { User } from '../../common/models/user.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-user-details',
  imports: [CommonModule,RouterModule, MatCardModule, MatButtonModule, MatIconModule,MatDividerModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails implements OnInit{
  private route = inject(ActivatedRoute);
  private dataService = inject(DataFetch);

  users = this.dataService.users;
  ngOnInit() {
  if (!this.users() || this.users().length === 0) {
    this.dataService.fetchUsers();
  }
}

  index = computed(() => Number(this.route.snapshot.paramMap.get('index')));
  user = computed<User>(() => this.users()?.[this.index()]);
}
