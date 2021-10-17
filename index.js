require('dotenv').config();
const Express = require('express');
const app = Express();
const conectarDB = require('./DB/db');

const PORT = 4000 || process.env.PUERTO;

conectarDB();

app.use(Express.json());


const twoFARoutes = require('./Routes/autenticar');

app.use('/api/user', twoFARoutes);

app.listen(PORT, () =>{
    console.log("Server up");
});