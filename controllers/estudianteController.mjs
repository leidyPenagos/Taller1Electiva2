import Estudiante from "../models/Estudiante.mjs";
import Maestro from "../models/Maestro.mjs";


export const obtenerEstudiantes = async (req, res) => {

  try {

    const estudiantes =
      await Estudiante.find()
        .populate(
          "maestro",
          "nombre documento especialidad"
        );

    res.json(estudiantes);

  } catch (error) {

    res.status(500).json({

      mensaje: "Error obteniendo estudiantes",

      error: error.message

    });

  }
};


export const obtenerEstudiante = async (req, res) => {

  try {

    const estudiante =
      await Estudiante.findById(
        req.params.id
      ).populate(
        "maestro",
        "nombre documento especialidad"
      );

    if (!estudiante) {

      return res.status(404).json({

        mensaje: "Estudiante no encontrado"

      });

    }

    res.json(estudiante);

  } catch (error) {

    res.status(500).json({

      mensaje: "Error obteniendo estudiante",

      error: error.message

    });

  }
};


export const crearEstudiante = async (req, res) => {

  try {

    const {
      nombre,
      documento,
      correo,
      edad,
      programa,
      maestro
    } = req.body;


    // Verificar que el maestro exista

    const maestroExiste =
      await Maestro.findById(maestro);

    if (!maestroExiste) {

      return res.status(404).json({

        mensaje: "El maestro indicado no existe"

      });

    }


    const estudiante =
      await Estudiante.create({

        nombre,

        documento,

        correo,

        edad,

        programa,

        maestro

      });


    const estudianteCompleto =
      await Estudiante.findById(
        estudiante._id
      ).populate(
        "maestro",
        "nombre documento especialidad"
      );


    res.status(201).json({

      mensaje:
        "Estudiante creado correctamente",

      estudiante: estudianteCompleto

    });

  } catch (error) {

    res.status(400).json({

      mensaje:
        "Error creando estudiante",

      error: error.message

    });

  }
};


export const actualizarEstudiante =
  async (req, res) => {

    try {

      if (req.body.maestro) {

        const maestroExiste =
          await Maestro.findById(
            req.body.maestro
          );

        if (!maestroExiste) {

          return res.status(404).json({

            mensaje:
              "El nuevo maestro no existe"

          });

        }

      }


      const estudiante =
        await Estudiante.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
            runValidators: true
          }

        ).populate(

          "maestro",

          "nombre documento especialidad"

        );


      if (!estudiante) {

        return res.status(404).json({

          mensaje:
            "Estudiante no encontrado"

        });

      }


      res.json({

        mensaje:
          "Estudiante actualizado correctamente",

        estudiante

      });

    } catch (error) {

      res.status(400).json({

        mensaje:
          "Error actualizando estudiante",

        error: error.message

      });

    }
  };


export const eliminarEstudiante =
  async (req, res) => {

    try {

      const estudiante =
        await Estudiante.findByIdAndDelete(
          req.params.id
        );


      if (!estudiante) {

        return res.status(404).json({

          mensaje:
            "Estudiante no encontrado"

        });

      }


      res.json({

        mensaje:
          "Estudiante eliminado correctamente"

      });

    } catch (error) {

      res.status(500).json({

        mensaje:
          "Error eliminando estudiante",

        error: error.message

      });

    }
  };