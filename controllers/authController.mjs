import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.mjs";

export const registrar = async (req, res) => {

  try {

    const {
      nombre,
      email,
      password
    } = req.body;

    if (!nombre || !email || !password) {

      return res.status(400).json({
        mensaje: "Nombre, correo y contraseña son obligatorios"
      });

    }

    const usuarioExistente = await Usuario.findOne({
      email
    });

    if (usuarioExistente) {

      return res.status(400).json({
        mensaje: "El correo ya está registrado"
      });

    }

    const passwordEncriptada = await bcrypt.hash(
      password,
      10
    );

    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordEncriptada
    });

    res.status(201).json({

      mensaje: "Usuario registrado correctamente",

      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }

    });

  } catch (error) {

    res.status(500).json({
      mensaje: "Error registrando usuario",
      error: error.message
    });

  }
};


export const login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios"
      });

    }

    const usuario = await Usuario.findOne({
      email
    });

    if (!usuario) {

      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });

    }

    const passwordCorrecta = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecta) {

      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });

    }

    const token = jwt.sign(

      {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1h"
      }

    );

    res.json({

      mensaje: "Inicio de sesión exitoso",

      token

    });

  } catch (error) {

    res.status(500).json({

      mensaje: "Error iniciando sesión",

      error: error.message

    });

  }
};