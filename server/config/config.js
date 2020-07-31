//====================
//Puerto
//====================
process.env.PORT = process.env.PORT || 3000;


//====================
//Entorno
//====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//====================
//DB
//====================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

//====================
//Expires in
//====================
process.env.EXPIRES_IN = 60 * 60 * 24 * 30;
//====================
//Autenthication seed
//====================

process.env.SEED = process.env.SEED || 'juanyss88';

process.env.URLDB = urlDB;