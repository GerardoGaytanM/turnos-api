const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const TurnoSchema =  new mongoose.Schema({
    nombre_completo: String,
    curp: String,
    numero: Number,
    nombre: String,
    apellido_materno: String,
    apellido_paterno: String,
    telefono: String,
    celular: String,
    correo: String,
    nivel: Number,
    municipio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'municipio'
    },
    asunto: Number,
    estatus: {
        type: Number,
        default: 0
    }

})
.pre('save', async function (){

    if (!this.numero) {
        let { numero } = await this.model('Turno').getNewNumero(this.municipio)
        this.numero = numero
    }

})

/**
 * @method getNewFolio
 * @description retorna un nuevo folio para una nueva inversion 
 * */
TurnoSchema.statics.getNewNumero = async function (municipio_id) {
    let latest_numero = await this.model('Turno').findOne({municipio: municipio_id}).sort({ numero: -1 })

    let numero = (latest_numero != null) ? (latest_numero.numero + 1) : 1
    return {
        numero,
    }
}

TurnoSchema.plugin(mongoosePaginate);
TurnoSchema.plugin(mongooseAggregatePaginate)

const Turno = mongoose.model(
    "Turno",
    TurnoSchema
   
)

Turno.aggregatePaginate.options = {
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




module.exports = Turno;