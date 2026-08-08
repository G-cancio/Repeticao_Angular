import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VeiculosAPI } from '../models/veiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  private http = inject(HttpClient);
  private urlVehicle = 'http://localhost:3000/vehicle';

  getVehicles(): Observable<VeiculosAPI> {
    return this.http.get<VeiculosAPI>(this.urlVehicle);
  }
}
