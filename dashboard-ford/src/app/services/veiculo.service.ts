import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VeiculosAPI, VeiculoDado } from '../models/veiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  private http = inject(HttpClient);
  private urlVehicle = 'http://localhost:3000/vehicle';
  private urlVehicleData = 'http://localhost:3000/vehicleData';

  getVehicles(): Observable<VeiculosAPI> {
    return this.http.get<VeiculosAPI>(this.urlVehicle);
  }

  getVehicleData(): Observable<VeiculoDado[]> {
    return this.http.get<VeiculoDado[]>(this.urlVehicleData);
  }
}
