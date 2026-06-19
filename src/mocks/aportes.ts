export type EstadoAporte = 'PAGADO' | 'PENDIENTE';

export interface AporteMensual {
  id: string;
  mes: number;
  anio: number;
  mesLabel: string;
  mesCorto: string;
  monto: number;
  estado: EstadoAporte;
  fechaPago: string | null;
}

export const mockAportes = {
  totalAcumulado: 3450.0,
  aporteMensual: 50.0,
  tasaRendimiento: 4.5,
  proyeccionAnual: 3650.0,
  mesesAcumulados: 69,
  historial: [
    { id: 'a_001', mes: 7,  anio: 2025, mesLabel: 'Julio 2025',      mesCorto: 'Jul', monto: 50, estado: 'PAGADO', fechaPago: '2025-07-01' },
    { id: 'a_002', mes: 8,  anio: 2025, mesLabel: 'Agosto 2025',     mesCorto: 'Ago', monto: 50, estado: 'PAGADO', fechaPago: '2025-08-01' },
    { id: 'a_003', mes: 9,  anio: 2025, mesLabel: 'Septiembre 2025', mesCorto: 'Sep', monto: 50, estado: 'PAGADO', fechaPago: '2025-09-01' },
    { id: 'a_004', mes: 10, anio: 2025, mesLabel: 'Octubre 2025',    mesCorto: 'Oct', monto: 50, estado: 'PAGADO', fechaPago: '2025-10-01' },
    { id: 'a_005', mes: 11, anio: 2025, mesLabel: 'Noviembre 2025',  mesCorto: 'Nov', monto: 50, estado: 'PAGADO', fechaPago: '2025-11-01' },
    { id: 'a_006', mes: 12, anio: 2025, mesLabel: 'Diciembre 2025',  mesCorto: 'Dic', monto: 50, estado: 'PAGADO', fechaPago: '2025-12-01' },
    { id: 'a_007', mes: 1,  anio: 2026, mesLabel: 'Enero 2026',      mesCorto: 'Ene', monto: 50, estado: 'PAGADO', fechaPago: '2026-01-01' },
    { id: 'a_008', mes: 2,  anio: 2026, mesLabel: 'Febrero 2026',    mesCorto: 'Feb', monto: 50, estado: 'PAGADO', fechaPago: '2026-02-01' },
    { id: 'a_009', mes: 3,  anio: 2026, mesLabel: 'Marzo 2026',      mesCorto: 'Mar', monto: 50, estado: 'PAGADO', fechaPago: '2026-03-01' },
    { id: 'a_010', mes: 4,  anio: 2026, mesLabel: 'Abril 2026',      mesCorto: 'Abr', monto: 50, estado: 'PAGADO', fechaPago: '2026-04-01' },
    { id: 'a_011', mes: 5,  anio: 2026, mesLabel: 'Mayo 2026',       mesCorto: 'May', monto: 50, estado: 'PAGADO', fechaPago: '2026-05-01' },
    { id: 'a_012', mes: 6,  anio: 2026, mesLabel: 'Junio 2026',      mesCorto: 'Jun', monto: 50, estado: 'PAGADO', fechaPago: '2026-06-01' },
  ] as AporteMensual[],
};
