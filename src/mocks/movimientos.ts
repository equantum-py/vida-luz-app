export type TipoMovimiento = 'PAGO_CUOTA' | 'APORTE' | 'DESEMBOLSO' | 'RENDIMIENTO';
export type SignoMovimiento = 'DEBITO' | 'CREDITO';

export interface Movimiento {
  id: string;
  fecha: string;
  fechaFormato: string;
  descripcion: string;
  tipo: TipoMovimiento;
  signo: SignoMovimiento;
  monto: number;
  referencia: string;
  icono: string;
}

export const mockMovimientos: Movimiento[] = [
  {
    id: 'mov_001',
    fecha: '2026-06-05',
    fechaFormato: '05 Jun 2026',
    descripcion: 'Pago cuota #17 — Crédito Ordinario',
    tipo: 'PAGO_CUOTA',
    signo: 'DEBITO',
    monto: 185.5,
    referencia: 'PAG-2026-06-0247',
    icono: 'card-outline',
  },
  {
    id: 'mov_002',
    fecha: '2026-06-01',
    fechaFormato: '01 Jun 2026',
    descripcion: 'Aporte mensual — Junio 2026',
    tipo: 'APORTE',
    signo: 'DEBITO',
    monto: 50.0,
    referencia: 'APO-2026-06-0102',
    icono: 'trending-up-outline',
  },
  {
    id: 'mov_003',
    fecha: '2026-05-05',
    fechaFormato: '05 May 2026',
    descripcion: 'Pago cuota #16 — Crédito Ordinario',
    tipo: 'PAGO_CUOTA',
    signo: 'DEBITO',
    monto: 185.5,
    referencia: 'PAG-2026-05-0198',
    icono: 'card-outline',
  },
  {
    id: 'mov_004',
    fecha: '2026-05-01',
    fechaFormato: '01 May 2026',
    descripcion: 'Aporte mensual — Mayo 2026',
    tipo: 'APORTE',
    signo: 'DEBITO',
    monto: 50.0,
    referencia: 'APO-2026-05-0089',
    icono: 'trending-up-outline',
  },
  {
    id: 'mov_005',
    fecha: '2026-04-05',
    fechaFormato: '05 Abr 2026',
    descripcion: 'Pago cuota #15 — Crédito Ordinario',
    tipo: 'PAGO_CUOTA',
    signo: 'DEBITO',
    monto: 185.5,
    referencia: 'PAG-2026-04-0156',
    icono: 'card-outline',
  },
  {
    id: 'mov_006',
    fecha: '2026-04-01',
    fechaFormato: '01 Abr 2026',
    descripcion: 'Aporte mensual — Abril 2026',
    tipo: 'APORTE',
    signo: 'DEBITO',
    monto: 50.0,
    referencia: 'APO-2026-04-0067',
    icono: 'trending-up-outline',
  },
  {
    id: 'mov_007',
    fecha: '2026-03-31',
    fechaFormato: '31 Mar 2026',
    descripcion: 'Rendimiento trimestral acreditado',
    tipo: 'RENDIMIENTO',
    signo: 'CREDITO',
    monto: 38.75,
    referencia: 'REN-2026-Q1-0045',
    icono: 'star-outline',
  },
];
