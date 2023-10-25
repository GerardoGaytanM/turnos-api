const { query } = require("express");
const config = require("../config/auth.config");
const { producto } = require("../models");
const db = require("../models");
const Turno = db.turno;
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types;

exports.list = async ({ query }, res) => {

    let body = query

    console.log(query)
    let buscar = (query.buscar == undefined) ? '.*' : query.buscar + '.*'

    let pipeline = []

    if (query.municipio) {
        pipeline.push({
            $match: {
                municipio: new ObjectId(query.municipio)
            }
        })
    }

    pipeline.push( 
        {
            $lookup:
            {
                from: "municipios",
                localField: "municipio",
                foreignField: "_id",
                as: "municipio",
            },
        },
        {
            $unwind:
            {
                path: "$municipio",
            },
        },
    )

    if (query.municipio_id) {
        pipeline.push({
            $match: {
                municipio: new ObjectId(query.municipio_id)
            }
        })
    }

    if (query.search) {
        pipeline.push({
            $match: {
                $and: [
                    {
                        $or: [
                            { curp: new RegExp(query.search, "i") },
                            { nombre: new RegExp(query.search, "i") },
                            { apellido_paterno: new RegExp(query.search, "i") },
                            { apellido_materno: new RegExp(query.search, "i") },
                            { nombre_completo: new RegExp(query.search, "i") },
                            { correo: new RegExp(query.search, "i") },
                            { telefono: new RegExp(query.search, "i") },
                        ]
                    },
                ]
            }

        })
    }

    console.log(require('util').inspect(pipeline, {showHidden: false, depth: null, colors: true}))


    return res.status(200).json({
        success: true,
        message: 'Consulta exitosa',
        data: await Turno.aggregatePaginate(Turno.aggregate(pipeline), {
            page: query.page ?? 1,
            limit: query.limit ?? 10
        })
    })

};

exports.get = async ({ query }, res) => {

    const body = query;


    let turno = null

    if (body.id) {
        turno = await Turno.findOne({ _id: body.id })
        return res.status(200).json({
            success: true,
            message: 'Consulta exitosa',
            data: turno
        })
    }


    else {
        return res.status(400).json({
            success: false,
            message: 'No existe el turno.',
        })
    }
};

exports.getPublic = async ({ query }, res) => {

    console.log('body getPublic', query)

    let turno = await Turno.findOne({ curp: query.curp, numero: Number(query.numero), municipio: query.municipio })



    if (turno) {
        return res.status(200).json({
            success: true,
            message: 'Consulta exitosa.',
            data: turno
        })
    }
    else {
        return res.status(400).json({
            success: false,
            message: 'No existe el turno.',
        })
    }
};


exports.add = async (req, res) => {

    let turno = new Turno(req.body);

    console.log('new turno', req.body);

    turno.save()
        .then(async turno => {
            console.log("chichepudo")
            return res.status(200).json({
                success: true,
                message: "Turno creado exitosamente",
                data: turno
            })
        })
        .catch(async error => {
            console.log('¿error', error)
            return res.status(400).json({
                success: false,
                message: (error)
            })
        })
};

exports.update = async (req, res) => {
    let body = req.body

    Turno.findOne({ _id: body.id })
        .then(async (turno) => {

            if (body.nombre_completo !== undefined) turno.nombre_completo = body.nombre_completo
            if (body.curp !== undefined) turno.curp = body.curp
            if (body.numero !== undefined) turno.numero = body.numero
            if (body.nombre !== undefined) turno.nombre = body.nombre
            if (body.nombre_completo !== undefined) turno.nombre_completo = body.nombre_completo
            if (body.apellido_materno !== undefined) turno.apellido_materno = body.apellido_materno
            if (body.apellido_paterno !== undefined) turno.apellido_paterno = body.apellido_paterno
            if (body.telefono !== undefined) turno.telefono = body.telefono
            if (body.celular !== undefined) turno.celular = body.celular
            if (body.correo !== undefined) turno.correo = body.correo
            if (body.nivel !== undefined) turno.nivel = body.nivel
            if (body.municipio !== undefined) turno.municipio = body.municipio
            if (body.asunto !== undefined) turno.asunto = body.asunto
            if (body.estatus !== undefined) turno.estatus = body.estatus


            await turno.save()
                .then(async (cli) => {
                    return res.status(200).json({
                        success: true,
                        message: 'Turno Actualizado!',
                        data: turno
                    })
                })
                .catch(error => {
                    console.log(error)
                    return res.status(400).json({
                        success: false,
                        errors: error,
                        message: 'Turno no actualizado!',
                    })
                })
        })
        .catch((err) => response.status(404).json({ err, message: 'Turno no encontrado!' }));
}

exports.remove = async ({ query }, res) => {
    const body = query;


    let turno = null

    if (body.id) {
        turno = await Turno.findOneAndRemove({ _id: body.id })
        return res.status(200).json({
            success: true,
            message: 'Eliminado exitosamente',
            data: turno
        })
    }


    else {
        return res.status(400).json({
            success: false,
            message: 'No existe el turno.',
        })
    }
}