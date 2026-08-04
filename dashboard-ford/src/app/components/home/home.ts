import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private router = inject(Router);

  logout() {
    localStorage.removeItem('usuarioLogado');
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}