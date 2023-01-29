import { VentaDetalle } from './venta-detalle';

export interface Venta {
  ventaId?: number,
  numeroDocumento?: string,
  tipoPago: string,
  fechaRegistro?: string,
  total: string,
  ventaDetalle: VentaDetalle[]
}
