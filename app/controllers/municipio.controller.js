const { query } = require("express");
const config = require("../config/auth.config");
const db = require("../models");
const Municipio = db.municipio;
const mongoose = require('mongoose')

exports.list = async ({ query }, res) => {

    return res.status(200).json({
        success: true,
        message: 'Consulta exitosa',
        data: await Municipio.find({})
    })

};

