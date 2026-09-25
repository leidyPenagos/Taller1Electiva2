import express from "express";

import {
  obtenerEstudiantes,
  obtenerEstudiante,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante
} from "../controllers/estudianteController.mjs";

import {
  verificarToken
} from "../middleware/authMiddleware.mjs";

const router = express.Router();


router.get(
  "/",
  verificarToken,
  obtenerEstudiantes
);


router.get(
  "/:id",
  verificarToken,
  obtenerEstudiante
);


router.post(
  "/",
  verificarToken,
  crearEstudiante
);


router.put(
  "/:id",
  verificarToken,
  actualizarEstudiante
);


router.delete(
  "/:id",
  verificarToken,
  eliminarEstudiante
);


export default router;