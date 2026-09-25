import Maestro from "../models/Maestro.mjs";
import Estudiante from "../models/Estudiante.mjs";


export const obtenerMaestros = async (req, res) => {

  try {

    const maestros = await Maestro.find();

    res.json(maestros);

  } catch (error) {

    res.status(500).json({
      mensaje: "Error obteniendo maestros",
      error: error.message
    });

  }
};


export const obtenerMaestro = async (req, res) => {

  try {

    const maestro = await Maestro.findById(
      req.params.id
    );

    if (!maestro) {

      return res.status(404).json({
        mensaje: "Maestro no encontrado"
      });

    }

    res.json(maestro);

  } catch (error) {

    res.status(500).json({
      mensaje: "Error obteniendo maestro",
      error: error.message
    });

  }
};


export const crearMaestro = async (req, res) => {

  try {

    const maestro = await Maestro.create(
      req.body
    );

    res.status(201).json({

      mensaje: "Maestro creado correctamente",

      maestro

    });

  } catch (error) {

    res.status(400).json({

      mensaje: "Error creando maestro",

      error: error.message

    });

  }
};


export const actualizarMaestro = async (req, res) => {

  try {

    const maestro =
      await Maestro.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
          runValidators: true
        }

      );

    if (!maestro) {

      return res.status(404).json({
        mensaje: "Maestro no encontrado"
      });

    }

    res.json({

      mensaje: "Maestro actualizado correctamente",

      maestro

    });

  } catch (error) {

    res.status(400).json({

      mensaje: "Error actualizando maestro",

      error: error.message

    });

  }
};


export const eliminarMaestro = async (req, res) => {

  try {

    const maestro =
      await Maestro.findByIdAndDelete(
        req.params.id
      );

    if (!maestro) {

      return res.status(404).json({
        mensaje: "Maestro no encontrado"
      });

    }

    // Eliminamos también los estudiantes
    // asociados a ese maestro.

    await Estudiante.deleteMany({
      maestro: req.params.id
    });

    res.json({

      mensaje:
        "Maestro y estudiantes asociados eliminados correctamente"

    });

  } catch (error) {

    res.status(500).json({

      mensaje: "Error eliminando maestro",

      error: error.message

    });

  }
};


export const obtenerEstudiantesDelMaestro =
  async (req, res) => {

    try {

      const maestro =
        await Maestro.findById(req.params.id);

      if (!maestro) {

        return res.status(404).json({
          mensaje: "Maestro no encontrado"
        });

      }

      const estudiantes =
        await Estudiante.find({
          maestro: req.params.id
        }).populate(
          "maestro",
          "nombre especialidad"
        );

      res.json({

        maestro: maestro.nombre,

        cantidad: estudiantes.length,

        estudiantes

      });

    } catch (error) {

      res.status(500).json({

        mensaje:
          "Error obteniendo estudiantes del maestro",

        error: error.message

      });

    }
  };