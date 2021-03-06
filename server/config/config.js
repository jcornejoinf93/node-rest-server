//==============================
// PORT
//==============================
process.env.PORT = process.env.PORT || 3000;

//==============================
// Entorno
//==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==============================
// Base de Datos
//==============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.NODE_ENV.MONGO_URL;
}

process.env.URLDB = urlDB;

//==============================
// Expiraciòn token
//==============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dìas
//

//48 = 48 hrs

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//==============================
// SEED autenticaciòn
//==============================

process.env.SEED = process.env.SEED || 'secret-seed-desa';

//==============================
// Google Client ID
//==============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '327291741131-iu8uunqvg2jpak6v56bl83o9scs6sat2.apps.googleusercontent.com';