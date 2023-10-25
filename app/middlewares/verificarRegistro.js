const db = require("../models");
const ROLES = db.ROLES
const Usuario = db.usuario

verificarRolExiste = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `El Rol ${req.body.roles[i]} no existe!`
        });
        return;
      }
    }
  }
  next();
};

verificarUsuarioDuplicado = (req, res, next) => {
    //Nombre de usuario
    Usuario.findOne({
        usuario: req.body.usuario
    }).exec((err, usuario) => {
        if(err) {
            res.status(500).send({message: err});
            return;
        }
        if (usuario) {
            res.status(400).send({message: 'El Nombre de usuraio ya esta en uso !!'});
            return;
        }
        next();
    })
};



const verificarRegistro = {
    verificarUsuarioDuplicado,
    verificarRolExiste
};

module.exports = verificarRegistro;

