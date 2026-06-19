export type TipoNotificacion = 'ALERTA' | 'INFORMACION' | 'EXITO' | 'EVENTO' | 'MANTENIMIENTO';

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: TipoNotificacion;
  icono: string;
  fecha: string;
  fechaFormato: string;
  leida: boolean;
}

export const mockNotificaciones: Notificacion[] = [
  {
    id: 'not_001',
    titulo: 'Cuota próxima a vencer',
    mensaje:
      'Tu cuota de $185.50 del Crédito Ordinario vence el 5 de julio. Te recomendamos realizar el pago con anticipación para mantener tu historial.',
    tipo: 'ALERTA',
    icono: 'alarm-outline',
    fecha: '2026-06-19',
    fechaFormato: 'Hoy',
    leida: false,
  },
  {
    id: 'not_002',
    titulo: 'Asamblea General Ordinaria 2026',
    mensaje:
      'Te invitamos a nuestra Asamblea General el sábado 28 de junio a las 10h00 en la sede principal. Tu participación es fundamental.',
    tipo: 'EVENTO',
    icono: 'people-outline',
    fecha: '2026-06-18',
    fechaFormato: 'Ayer',
    leida: false,
  },
  {
    id: 'not_003',
    titulo: 'Pago registrado exitosamente',
    mensaje:
      'Recibimos tu pago de $185.50 correspondiente a la cuota #17 de tu Crédito Ordinario. ¡Gracias por cumplir a tiempo!',
    tipo: 'EXITO',
    icono: 'checkmark-circle-outline',
    fecha: '2026-06-05',
    fechaFormato: '05 Jun 2026',
    leida: true,
  },
  {
    id: 'not_004',
    titulo: 'Aporte mensual acreditado',
    mensaje:
      'Tu aporte mensual de $50.00 correspondiente a junio 2026 fue registrado correctamente. Total acumulado: $3,450.00.',
    tipo: 'EXITO',
    icono: 'checkmark-circle-outline',
    fecha: '2026-06-01',
    fechaFormato: '01 Jun 2026',
    leida: true,
  },
  {
    id: 'not_005',
    titulo: 'Rendimientos Q1 2026 acreditados',
    mensaje:
      'Los rendimientos del primer trimestre 2026 han sido calculados y acreditados en tu cuenta. Monto: $38.75. Revisa el detalle en Mis Aportes.',
    tipo: 'INFORMACION',
    icono: 'star-outline',
    fecha: '2026-03-31',
    fechaFormato: '31 Mar 2026',
    leida: true,
  },
  {
    id: 'not_006',
    titulo: 'Mantenimiento programado',
    mensaje:
      'El sistema estará en mantenimiento el sábado 21 de junio de 22h00 a 06h00 del domingo. Los servicios en línea no estarán disponibles.',
    tipo: 'MANTENIMIENTO',
    icono: 'settings-outline',
    fecha: '2026-05-30',
    fechaFormato: '30 May 2026',
    leida: true,
  },
];
