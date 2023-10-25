const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Usuario = db.usuario;
const Rol = db.rol;

verificarToken = (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
        console.log("no token")
        return res.status(403).send({message: "No hay token de autorizacion en tu solicitud !"});
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).send({ message: "No tienes autorizacion!" });
        }
        req.userId = decoded.id;
        next();
    });
};

esAdmin = (req, res, next) => {
    
    Usuario.findById(req.userId).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      
      Rol.find(
        {
          _id: { $in: user.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].nombre === 'administrador') {
              next();
              return;
            }
          }
          res.status(403).send({ message: "Se necesita ser administrador!" });
          return;
        }
      );
    });
};

const authJwt = {
    verificarToken,
    esAdmin
  };
module.exports = authJwt;
