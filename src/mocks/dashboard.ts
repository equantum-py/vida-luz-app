export const mockDashboard = {
  aportes: {
    totalAcumulado: 3450.0,
    aporteMensual: 50.0,
    ultimoAporte: '2026-06-01',
    tasaRendimientoAnual: 4.5,
  },
  creditoActivo: {
    id: 'cred_001',
    tipo: 'Crédito Ordinario',
    montoOriginal: 5000.0,
    capitalPendiente: 2847.23,
    cuotaMensual: 185.5,
    proximoPago: '2026-07-05',
    diasParaVencimiento: 16,
    estado: 'AL_DIA' as const,
    estadoLabel: 'Al Día',
  },
  proximaCuota: {
    monto: 185.5,
    fecha: '2026-07-05',
    creditoTipo: 'Crédito Ordinario',
    diasRestantes: 16,
  },
  resumenScore: {
    score: 87,
    scoreMax: 100,
    categoria: 'Excelente',
    descripcion: 'Historial de pagos impecable',
  },
};

export type MockDashboard = typeof mockDashboard;
