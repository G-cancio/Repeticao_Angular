import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { VeiculoService } from '../../services/veiculo.service';
import { Veiculo, VeiculoDado } from '../../models/veiculo.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  private router = inject(Router);
  private veiculoService = inject(VeiculoService);
  private cdr = inject(ChangeDetectorRef);

  veiculos: Veiculo[] = [];
  veiculoSelecionado: Veiculo | null = null;

  registrosFabrica: VeiculoDado[] = [];
  registrosFiltrados: VeiculoDado[] = [];
  codigoBusca: string = '';

  private buscaSubject = new Subject<string>();
  private buscaSubscription?: Subscription;

  ngOnInit(): void {
    this.carregarDadosDoDashboard();

    this.buscaSubscription = this.buscaSubject
      .pipe(
        debounceTime(300),
        map((termo) => termo.trim().toLowerCase()),
        filter((termo) => termo.length === 0 || termo.length >= 2),
        distinctUntilChanged()
      )
      .subscribe((termo) => {
        this.aplicarFiltro(termo);
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.buscaSubscription?.unsubscribe();
  }

  carregarDadosDoDashboard(): void {
    forkJoin({
      veiculos: this.veiculoService.getVehicles().pipe(map((res) => res.vehicles)),
      registros: this.veiculoService.getVehicleData()
    }).subscribe({
      next: ({ veiculos, registros }) => {
        this.veiculos = veiculos;
        this.registrosFabrica = registros;

        if (this.veiculos.length > 0) {
          this.veiculoSelecionado = this.veiculos[0];
        }

        this.aplicarFiltro(this.codigoBusca);

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar dados do dashboard:', err)
    });
  }

  private aplicarFiltro(termo: string): void {
    if (termo) {
      this.registrosFiltrados = this.registrosFabrica.filter((reg) =>
        String(reg.vin).toLowerCase().includes(termo)
      );

      const registroEncontrado = this.registrosFiltrados[0];
      if (registroEncontrado) {
        const veiculoDono = this.veiculos.find(
          (v) => Number(v.id) === Number(registroEncontrado.id)
        );
        if (veiculoDono) {
          this.veiculoSelecionado = veiculoDono;
        }
      }
      return;
    }

    if (!this.veiculoSelecionado) {
      this.registrosFiltrados = [];
      return;
    }

    this.registrosFiltrados = this.registrosFabrica.filter(
      (reg) => Number(reg.id) === Number(this.veiculoSelecionado!.id)
    );
  }

  onVeiculoChange(): void {
    this.codigoBusca = '';
    this.aplicarFiltro('');
  }

  onCodigoBuscaInput(): void {
    this.buscaSubject.next(this.codigoBusca);
  }

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
