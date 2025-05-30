const request = require('supertest');
const app = require('../server.js').default;

let server;

describe('Rutas de Usuario: Crear y Login', () => {
  const nuevaInstitucion = {
    nombre: "Universidad del Valle Test1.0",
    contrasena: "test1234",
    colorPrimario: "#FF0000",
    colorSecundario: "#00FF00",
    direccion: "Calle 13 #100-00, Cali"
  };

  const nuevoUsuario = {
    nombre: "Test User",
    correo: "testuser1@example.com",
    contraseña: "test1234",
    celular: "3100000000",
    numeroIdentificacion: "1234267890",
    tipoIdentificacion: "CC",
    institucion: "Universidad del Valle Test1.0"  // Ahora usamos el nombre de la institución creada
  };

  let token = '';
  let institucionId = '';

  // Antes de correr los tests, levanta el servidor en puerto random
  beforeAll(done => {
    server = app.listen(0, done); // 0 = puerto disponible automáticamente
  });

  // Al terminar los tests, cierra el servidor para liberar el puerto
  afterAll(done => {
    server.close(done);
  });

  it('Debe crear una nueva institución', async () => {
    const res = await request(server)
      .post('/api/institucion/')
      .field('nombre', nuevaInstitucion.nombre)
      .field('contrasena', nuevaInstitucion.contrasena)
      .field('colorPrimario', nuevaInstitucion.colorPrimario)
      .field('colorSecundario', nuevaInstitucion.colorSecundario)
      .field('direccion', nuevaInstitucion.direccion);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.institucion).toHaveProperty('id');
    
    // Guardamos el ID de la institución para usarlo luego si es necesario
    institucionId = res.body.institucion.id;
  });

  it('Debe logearse correctamente con el nuevo usuario', async () => {
    const res = await request(server)
      .post('/api/usuario/login')
      .send({
        celular: nuevoUsuario.celular,
        contraseña: nuevoUsuario.contraseña
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('Debe verificar el token correctamente', async () => {
    const res = await request(server)
      .get('/api/usuario/auth/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.authenticated).toBe(true);
    expect(res.body.user).toHaveProperty('celular');
    expect(res.body.user.celular).toBe(nuevoUsuario.celular);
  });
});