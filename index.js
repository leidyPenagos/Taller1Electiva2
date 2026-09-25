import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import swaggerUi from "swagger-ui-express";

import connectDB from "./driver/connect-db.mjs";

import authRoutes from "./routes/authRoutes.mjs";
import maestroRoutes from "./routes/maestroRoutes.mjs";
import estudianteRoutes from "./routes/estudianteRoutes.mjs";

import swaggerSpec from "./swagger/swagger.mjs";


dotenv.config();


const app = express();

const PORT =
  process.env.PORT || 3000;


/*
========================================
CONEXIÓN BASE DE DATOS
========================================
*/

connectDB();


/*
========================================
MIDDLEWARES
========================================
*/

app.use(cors());

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.static("public"));


/*
========================================
VISTAS
========================================
*/

app.set(
  "view engine",
  "ejs"
);


/*
========================================
PÁGINA PRINCIPAL
========================================
*/

app.get("/", (req, res) => {

  res.render(
    "index",
    {
      title:
        "API Gestión de Estudiantes y Maestros"
    }
  );

});


/*
========================================
PANEL (varias vistas Bootstrap)
========================================
*/

app.get("/panel", (req, res) => {
  res.redirect("/panel/maestros");
});

app.get("/panel/login", (req, res) => {
  res.render("auth", {
    title: "Iniciar sesión"
  });
});

app.get("/panel/maestros", (req, res) => {
  res.render("panel/maestros", {
    title: "Maestros",
    active: "maestros"
  });
});

app.get("/panel/estudiantes", (req, res) => {
  res.render("panel/estudiantes", {
    title: "Estudiantes",
    active: "estudiantes"
  });
});


/*
========================================
SWAGGER
========================================
*/

app.use(
  "/api-docs",

  swaggerUi.serve,

  swaggerUi.setup(
    swaggerSpec
  )
);


/*
========================================
RUTAS API
========================================
*/

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/maestros",
  maestroRoutes
);


app.use(
  "/api/estudiantes",
  estudianteRoutes
);


/*
========================================
RUTA DE PRUEBA
========================================
*/

app.get(
  "/api",
  (req, res) => {

    res.json({

      mensaje:
        "API de Estudiantes y Maestros funcionando correctamente",

      endpoints: {

        swagger:
          "/api-docs",

        login:
          "/api/auth/login",

        registro:
          "/api/auth/register",

        maestros:
          "/api/maestros",

        estudiantes:
          "/api/estudiantes"

      }

    });

  }
);


/*
========================================
MANEJO DE RUTAS NO ENCONTRADAS
========================================
*/

app.use(
  (req, res) => {

    res.status(404).json({

      mensaje:
        "Ruta no encontrada"

    });

  }
);


/*
========================================
INICIAR SERVIDOR
========================================
*/

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log("");
    console.log(
      "======================================"
    );

    console.log(
      " API ESTUDIANTES Y MAESTROS"
    );

    console.log(
      "======================================"
    );

    console.log(
      `Servidor: http://localhost:${PORT}`
    );

    console.log(
      `Swagger: http://localhost:${PORT}/api-docs`
    );

    console.log(
      "======================================"
    );

  }
);