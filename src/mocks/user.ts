export const mockUser = {
  id: 'usr_001',
  nombre: 'Carlos Alberto',
  apellido: 'Mendoza Vega',
  nombreCompleto: 'Carlos Alberto Mendoza Vega',
  iniciales: 'CM',
  ci: '1756823940',
  numeroSocio: '002847',
  fechaIngreso: '2019-01-15',
  anioIngreso: 2019,
  tipo: 'Socio Activo',
  email: 'cmendoza@gmail.com',
  celular: '0985-234-567',
  direccion: 'Av. Amazonas N35-234 y Juan Pablo Sanz',
  ciudad: 'Quito',
  provincia: 'Pichincha',
  scoreCooperativo: 87,
  scoreMax: 100,
  scoreCategoria: 'Excelente',
  pinDemo: '1234',
};

export type MockUser = typeof mockUser;
