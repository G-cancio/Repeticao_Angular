import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/user';

  buscarPorNome(nome: string): Observable<Usuario | null> {
    return this.http.get<Usuario | null>(this.apiUrl, {
      params: { nome }
    });
  }
}