import mongoose from "mongoose";

const maestroSchema = new mongoose.Schema(
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

    telefono: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      trim: true
    },

    especialidad: {
      type: String,
      required: [true, "La especialidad es obligatoria"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Maestro = mongoose.model("Maestro", maestroSchema);

export default Maestro;