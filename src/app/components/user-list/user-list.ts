import {
  Component,
  computed,
  inject,
  signal,
  effect,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DataFetch } from '../../common/services/data-fetch';
import type { User } from '../../common/models/user.model';

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
export class UserList implements OnInit, AfterViewInit {
  private userService = inject(DataFetch);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatSort) sort!: MatSort;

  users = this.userService.users;
  dataSource = new MatTableDataSource<User>();
  editRowIndex = signal<number | null>(null);

  columns = computed(() => Object.keys(this.users()?.[0] || {}));
  combinedColumns = computed(() => [...this.columns(), 'actions']);

  private hasAppliedDefaultSort = false;

  constructor() {
    // Effect to update data source when users change
    effect(() => {
      const userData = this.users();
      this.dataSource.data = userData || [];
      if (userData && userData.length > 0 && !this.hasAppliedDefaultSort) {
        setTimeout(() => this.tryApplyDefaultSort(), 0);
      }
    });
  }

  ngOnInit() {
    this.userService.fetchUsers();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    setTimeout(() => this.tryApplyDefaultSort(), 0);
  }

  private tryApplyDefaultSort() {
    if (this.hasAppliedDefaultSort || !this.sort) {
      return;
    }

    const userData = this.users();
    if (!userData || userData.length === 0) {
      return;
    }

    const firstCol = Object.keys(userData[0])[0];
    if (!firstCol) {
      return;
    }
    
    this.sort.active = firstCol;
    this.sort.direction = 'asc';
    this.dataSource.sort = this.sort;
    
    this.sort.sortChange.emit({
      active: firstCol,
      direction: 'asc',
    });
    
    this.hasAppliedDefaultSort = true;
    
    // Trigger change detection to update the view
    this.cdr.detectChanges();
  }

  // UI helpers
  isEditing = (index: number) => this.editRowIndex() === index;
  startEditing = (index: number) => this.editRowIndex.set(index);
  stopEditing = () => this.editRowIndex.set(null);
  rowIndex = (row: User) => this.users().indexOf(row);
  goToDetail = (index: number) => this.router.navigate(['/user', index]);
}