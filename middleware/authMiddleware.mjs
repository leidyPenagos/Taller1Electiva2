import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {

  try {

    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        mensaje: "No se proporcionó un token"
      });
    }

    const partes = authorization.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(401).json({
        mensaje: "Formato de token incorrecto"
      });
    }

    const token = partes[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      mensaje: "Token inválido o expirado"
    });

  }
};