import mongoose from "mongoose";

const estudianteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true
    },

    documento: {
      type: String,
      required: [true, "El documento es obligatorio"],
      unique: true,
      trim: true
    },

    correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true
    },

    edad: {
      type: Number,
      required: [true, "La edad es obligatoria"],
      min: [5, "La edad mínima es 5 años"],
      max: [100, "La edad máxima es 100 años"]
    },

    programa: {
      type: String,
      required: [true, "El programa es obligatorio"],
      trim: true
    },

    maestro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Maestro",
      required: [true, "El maestro es obligatorio"]
    }
  },
  {
    timestamps: true
  }
);

const Estudiante = mongoose.model(
  "Estudiante",
  estudianteSchema
);

export default Estudiante;