require('dotenv').config();
const Express = require('express');
const app = Express();
const conectarDB = require('./DB/db');
const cors = require('cors');

const PORT = 4000;

var corsOpt = {
    origin: '*', //poner nuestro dominio
    optionsSuccessStatus: 200
}

conectarDB();

app.use(Express.json());
app.use(cors(corsOpt));

const twoFARoutes = require('./Routes/autenticar');

app.use('/api/user', twoFARoutes);

app.listen(process.env.PUERTO || PORT)