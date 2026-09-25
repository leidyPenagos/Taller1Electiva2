import express from "express";

import {
  obtenerMaestros,
  obtenerMaestro,
  crearMaestro,
  actualizarMaestro,
  eliminarMaestro,
  obtenerEstudiantesDelMaestro
} from "../controllers/maestroController.mjs";

import {
  verificarToken
} from "../middleware/authMiddleware.mjs";

const router = express.Router();


router.get(
  "/",
  verificarToken,
  obtenerMaestros
);


router.get(
  "/:id",
  verificarToken,
  obtenerMaestro
);


router.get(
  "/:id/estudiantes",
  verificarToken,
  obtenerEstudiantesDelMaestro
);


router.post(
  "/",
  verificarToken,
  crearMaestro
);


router.put(
  "/:id",
  verificarToken,
  actualizarMaestro
);


router.delete(
  "/:id",
  verificarToken,
  eliminarMaestro
);


export default router;