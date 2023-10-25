const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.usuario = require("./usuario.model");
db.municipio = require("./municipio.model")
db.turno = require('./turno.model')
module.exports = db;