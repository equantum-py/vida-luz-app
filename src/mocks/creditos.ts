export type EstadoCuota = 'PAGADA' | 'PENDIENTE' | 'VENCIDA';
export type EstadoCredito = 'ACTIVO' | 'PAGADO' | 'REFINANCIADO';

export interface Cuota {
  numero: number;
  fechaPago: string;
  capital: number;
  interes: number;
  total: number;
  estado: EstadoCuota;
}

export interface Credito {
  id: string;
  tipo: string;
  descripcion: string;
  montoOriginal: number;
  capitalPendiente: number;
  cuotaMensual: number;
  tasaAnual: number;
  plazoMeses: number;
  cuotasPagadas: number;
  cuotasRestantes: number;
  fechaDesembolso: string;
  proximoPago: string | null;
  estado: EstadoCredito;
  estadoLabel: string;
  porcentajePagado: number;
  garantia: string;
  cronograma: Cuota[];
}

export const mockCreditos: Credito[] = [
  {
    id: 'cred_001',
    tipo: 'Crédito Ordinario',
    descripcion: 'Capital de trabajo — Negocio familiar',
    montoOriginal: 5000.0,
    capitalPendiente: 2847.23,
    cuotaMensual: 185.5,
    tasaAnual: 15.75,
    plazoMeses: 36,
    cuotasPagadas: 17,
    cuotasRestantes: 19,
    fechaDesembolso: '2025-01-05',
    proximoPago: '2026-07-05',
    estado: 'ACTIVO',
    estadoLabel: 'Al Día',
    porcentajePagado: 47,
    garantia: 'Quirografario',
    cronograma: [
      ...Array.from({ length: 17 }, (_, i) => ({
        numero: i + 1,
        fechaPago: `2025-0${(i % 9) + 1}-05`,
        capital: 112.45,
        interes: 73.05,
        total: 185.5,
        estado: 'PAGADA' as EstadoCuota,
      })),
      ...Array.from({ length: 19 }, (_, i) => ({
        numero: i + 18,
        fechaPago: `2026-0${(i % 9) + 1}-05`,
        capital: 118.3,
        interes: 67.2,
        total: 185.5,
        estado: 'PENDIENTE' as EstadoCuota,
      })),
    ],
  },
  {
    id: 'cred_002',
    tipo: 'Crédito de Consumo',
    descripcion: 'Compra de electrodomésticos del hogar',
    montoOriginal: 2000.0,
    capitalPendiente: 0,
    cuotaMensual: 98.5,
    tasaAnual: 16.3,
    plazoMeses: 24,
    cuotasPagadas: 24,
    cuotasRestantes: 0,
    fechaDesembolso: '2023-03-10',
    proximoPago: null,
    estado: 'PAGADO',
    estadoLabel: 'Pagado',
    porcentajePagado: 100,
    garantia: 'Quirografario',
    cronograma: [],
  },
];
