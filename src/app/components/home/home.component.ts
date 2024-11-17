import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  selectedUser: string = localStorage.getItem("username") ?? "";
  role: string = '';
  constructor(private lS: LoginService) {}
  verificar() {
    this.role = this.lS.showRole();
    return this.lS.verificar();
  }
}
