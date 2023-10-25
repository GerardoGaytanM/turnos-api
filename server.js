const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
var bcrypt = require("bcryptjs");

const municipios = require('./municipios.json')

const Usuario = db.usuario
const Municipio = db.municipio
db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Se ha conectado a la base de datos");
        initial();
    })
    .catch(err => {
        console.error("Error de conexion", err);
        process.exit();
    });

var corsOptions = {
    origin: "http://127.0.0.1:5173",
    credentials: true
};
app.use(cors(corsOptions));
//Para procesar solicitudes de tipo JSON
app.use(express.json());
//Para procesar solicitudes con datos codificados de tipo aplication/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
//Mensaje predeterminado
app.get("/", (req, res) => {
    res.json({ message: "Bienvenido a la API de la Turnos." });
});

//Rutas
require('./app/routes/auth.routes')(app);
require('./app/routes/usuario.routes')(app);
require('./app/routes/turno.routes')(app)
require('./app/routes/municipio.routes')(app)

// Establecer el puesto de escucha de solicitudes
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando el en siguiente puerto ${PORT}.`);
});

function initial() {
    Usuario.estimatedDocumentCount().then((count) => {
        if (count === 0) {
            new Usuario({
                usuario: "admin",
                nombre: "Administrador",
                clave: bcrypt.hashSync('123456', 8)
            }).save().then(err => {
                
                console.log("se agregó el usuario de 'admin'");
            }).catch(e =>{ throw Error(e)});
        }
    }
    )

    Municipio.estimatedDocumentCount().then((count) => {
        if (count === 0) {
            municipios.map((e) => {
                new Municipio({
                    nombre: e.nombre,
                }).save().then(err => {
                    console.log("se agregó el municipio de ", e.nombre);
                }).catch(e =>{ throw Error(e)});
            })
        }
    }
    )




}
