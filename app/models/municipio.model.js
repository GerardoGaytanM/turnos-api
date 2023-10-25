//Cada model.js es una tabla que se va a crear en la base de datos, mongoose es la libreria que se encarga de comunicarse
// entre el servidor y MongoDB

const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const MunicipioSchema = new mongoose.Schema({
  nombre: String
})

MunicipioSchema.plugin(mongoosePaginate);
MunicipioSchema.plugin(mongooseAggregatePaginate)

const Municipio = mongoose.model(
  "Municipio",
  MunicipioSchema
);

Municipio.aggregatePaginate.options = {
  customLabels: {
      totalDocs: 'total',
      docs: 'data',
      limit: 'limit',
      page: 'page',
      nextPage: 'next',
      prevPage: 'prev',
      totalPages: 'pages',
  },
  collation: { locale: 'es' }
}

module.exports = Municipio;