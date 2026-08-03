import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  usuarioInput: string = '';
  senhaInput: string = '';
  lembrarMeInput: boolean = false;
  mensagemErro: string = '';
  carregando: boolean = false;

  ngOnInit(): void {
    const loginAutomatico = localStorage.getItem('usuarioLogado');

    if (loginAutomatico === 'true') {
      this.mensagemErro = '';
      this.router.navigate(['/home']);
    }
  }

  fazerLogin(event: Event) {
    event.preventDefault();
    this.mensagemErro = '';
    this.carregando = true;

    this.usuarioService.buscarPorNome(this.usuarioInput).subscribe({
      next: (usuario) => {
        this.carregando = false;

        if (usuario && String(usuario.senha) === this.senhaInput) {
          if (this.lembrarMeInput) {
            localStorage.setItem('usuarioLogado', 'true');
          } else {
            sessionStorage.setItem('usuarioLogado', 'true');
          }

          this.router.navigate(['/home']);
        } else {
          this.mensagemErro = 'Usuário ou senha incorretos!';
        }
      },
      error: () => {
        this.carregando = false;
        this.mensagemErro = 'Não foi possível conectar ao servidor. Verifique se a API está rodando.';
      }
    });
  }
}