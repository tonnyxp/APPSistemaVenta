import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';
import { Venta } from '../interfaces/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private urlApi: string = `${environment.endpoint}/Venta`;

  constructor(private http: HttpClient) { }

  registrar(request: Venta): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}/Registrar`, request);
  }

  historial(buscarPor: string, numeroVenta: string, fechaInicio: string, fechaFin: string): Observable<ResponseApi> {
    const params = new HttpParams()
      .set('buscarPor', buscarPor)
      .set('numeroVenta', numeroVenta)
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    return this.http.get<ResponseApi>(`${this.urlApi}/Historial`, { params: params });
  }

  reporte(fechaInicio: string, fechaFin: string): Observable<ResponseApi> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    return this.http.get<ResponseApi>(`${this.urlApi}/Reporte`, { params: params });
  }
}
