import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VeiculoService } from '../../services/veiculo.service';
import { Veiculo } from '../../models/veiculo.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  private veiculoService = inject(VeiculoService);
  private cdr = inject(ChangeDetectorRef);

  veiculos: Veiculo[] = [];
  veiculoSelecionado: Veiculo | null = null;

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void {
    this.veiculoService.getVehicles().subscribe({
      next: (dados) => {
        if (dados && dados.vehicles) {
          this.veiculos = dados.vehicles;

          if (this.veiculos.length > 0) {
            this.veiculoSelecionado = this.veiculos[0];
          }

          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Erro ao carregar veículos:', err)
    });
  }

  onVeiculoChange(): void {}

  getFotoVeiculo(nome: string | undefined): string {
    if (!nome) return 'ford.png';
    if (nome === 'Bronco Sport') {
      return 'broncoSport.png';
    }
    return `${nome.toLowerCase()}.png`;
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebarMenu');
    if (sidebar) {
      sidebar.classList.toggle('fechada');
    }
  }

  irParaHome() {
    this.router.navigate(['/home']);
  }

  irParaDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
    sessionStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}