import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"]
    }
  },
  {
    timestamps: true
  }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;