const config = require("../config/auth.config");
const db = require("../models");
const Usuario = db.usuario;
const Rol = db.rol;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { usuario } = require("../models");

exports.registro = (req, res) => {
    console.log(req)
  const usuario = new Usuario({
    usuario: req.body.usuario,
    nombre: req.body.nombre,
    clave: bcrypt.hashSync(req.body.clave, 8)
  });
  usuario.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.roles) {
        console.log(req.body.body)
      Rol.find(
        {
          nombre: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "El usuario se ha registrado exitosamente!" });
          });
        }
      );
    } else {
      Rol.findOne({ name: "usuario" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        usuario.roles = [role._id];
        usuario.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "El usuario se ha registrado exitosamente!" });
        });
      });
    }
  });
};

exports.iniciarSesion = (req, res) => {
  console.log(req);
  Usuario.findOne({
    usuario: req.body.usuario
  })
    .then((usuario) => {

      if (!usuario) {
        return res.status(404).send({ message: "El usuario no se ha encontrado." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.clave,
        usuario.clave
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "La contraseña es invalida!"
        });
      }
      var token = jwt.sign({ id: usuario._id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        id: usuario._id,
        username: usuario.usuario,
        nombre: usuario.nombre,
        accessToken: token
      });
    }).catch( err => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    }
    );
};