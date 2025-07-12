import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DataFetch } from '../../common/services/data-fetch';
import type { User } from '../../common/models/user.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements AfterViewInit {
  private userService = inject(DataFetch);
  private router = inject(Router);

  users = this.userService.users;
  editRowIndex = signal<number | null>(null);

  columns = computed(() => Object.keys(this.users()?.[0] || {}));
  combinedColumns = computed(() => [...this.columns(), 'actions']);

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<User>();

  updateTableData = effect(() => {
    this.dataSource.data = this.users();
  });

  ngOnInit() {
    this.userService.fetchUsers();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    // Optional: Fix for nested values
    this.dataSource.sortingDataAccessor = (item, property) =>
      typeof item[property] === 'string' || typeof item[property] === 'number'
        ? item[property]
        : '';
  }

  /** Actions */
  isEditing = (index: number): boolean => this.editRowIndex() === index;
  startEditing = (index: number): void => this.editRowIndex.set(index);
  stopEditing = (): void => this.editRowIndex.set(null);
  rowIndex = (row: User): number => this.users().indexOf(row);

  goToDetail = (index: number): void => {
    this.router.navigate(['/user', index]);
  };
}
