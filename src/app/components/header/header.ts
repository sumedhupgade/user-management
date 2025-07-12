import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
