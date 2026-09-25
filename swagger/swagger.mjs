import swaggerJSDoc from "swagger-jsdoc";

const options = {

  definition: {

    openapi: "3.0.0",

    info: {

      title:
        "API Gestión de Estudiantes y Maestros",

      version: "1.0.0",

      description:
        "API REST para la gestión de estudiantes y maestros con MongoDB Atlas, Mongoose y JWT."

    },

    servers: [

      {
        url: "http://localhost:3000",

        description: "Servidor local"
      }

    ],

    components: {

      securitySchemes: {

        bearerAuth: {

          type: "http",

          scheme: "bearer",

          bearerFormat: "JWT"

        }

      },


      schemas: {

        Maestro: {

          type: "object",

          required: [
            "nombre",
            "documento",
            "correo",
            "telefono",
            "especialidad"
          ],

          properties: {

            nombre: {
              type: "string",
              example: "Carlos Pérez"
            },

            documento: {
              type: "string",
              example: "12345678"
            },

            correo: {
              type: "string",
              example: "carlos@universidad.edu.co"
            },

            telefono: {
              type: "string",
              example: "3001234567"
            },

            especialidad: {
              type: "string",
              example: "Matemáticas"
            }

          }

        },


        Estudiante: {

          type: "object",

          required: [
            "nombre",
            "documento",
            "correo",
            "edad",
            "programa",
            "maestro"
          ],

          properties: {

            nombre: {
              type: "string",
              example: "Ana López"
            },

            documento: {
              type: "string",
              example: "1001234567"
            },

            correo: {
              type: "string",
              example: "ana@universidad.edu.co"
            },

            edad: {
              type: "integer",
              example: 20
            },

            programa: {
              type: "string",
              example: "Ingeniería de Sistemas"
            },

            maestro: {
              type: "string",
              example: "68d123456789abcdef123456"
            }

          }

        },


        Registro: {

          type: "object",

          required: [
            "nombre",
            "email",
            "password"
          ],

          properties: {

            nombre: {
              type: "string",
              example: "Administrador"
            },

            email: {
              type: "string",
              example: "admin@universidad.edu.co"
            },

            password: {
              type: "string",
              example: "123456"
            }

          }

        },


        Login: {

          type: "object",

          required: [
            "email",
            "password"
          ],

          properties: {

            email: {
              type: "string",
              example: "admin@universidad.edu.co"
            },

            password: {
              type: "string",
              example: "123456"
            }

          }

        }

      }

    }

  },

  apis: []

};


const swaggerSpec =
  swaggerJSDoc(options);

export default swaggerSpec;