const express = require("express");
const logger = require("./logger");
const app = express();

// Arreglo vacio para generar errores
const alumnos = []


// Endpoint principal para mostrar el uso de debug
app.get("/", (req, res, next) => {
  logger.debug("Alguien cargó la página principal!");
  res.status(200).send("Hola");
});


// Endpoint diseñado para mostrar el uso de warn, además de que se validan los datos antes de hacer un procedimiento
app.get("/alumnos", (req, res, next) => {
  if (alumnos.length !== 0) {
    res.status(200).send(JSON.stringify(alumnos))    
  } else {
    logger.warn("Error: No existen alumnos");
    res.status(500).send("Error, consulte al admin");
  }
});


// Endpoint diseñado para mostrar el funcionamiento del try-catch cuando no se validan los datos junto con Winston.
app.get("/error", (req, res, next) => {
  try {
    res.status(200).send(alumnos[0].codigo)
  } catch (e) {
    logger.error("Error - " + e);
    res.status(500).send("Error, consulte al admin");
  }
});


// Inicialización de la API
app.listen(3000, () => {
  logger.info("API corriendo en puerto 3000");
});