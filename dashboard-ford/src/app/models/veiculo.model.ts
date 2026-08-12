export interface Veiculos extends Array<Veiculo> {}

export interface Veiculo {
  id: number | string
  vehicle: string
  volumetotal: number | string
  connected: number | string
  softwareUpdates: number | string
}

export interface VeiculosAPI {
  vehicles: Veiculos;
}

export interface VeiculoDado {
  id: number | string
  vin: string
  odometer: number | string
  tirePressure: number | string
  status: string
  batteryStatus: number | string
  fuelLevel: number | string
  lat: number | string
  long: number | string
}
