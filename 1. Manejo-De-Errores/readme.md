# Ejemplo de herramientas para el manejo de errores utilizando Winstonjs
## Información
Este proyecto es un ejemplo del manejo de errores utilizando Winston.js en una API desarrollada en Express.js para la materia de Computación Tolerante a Fallas. 

Se diseño esta API para mostrar 4 diferentes niveles de severidad que puede manejar Winston: Info, Debug, Warning y Error.

Se crearón dos salidas del logger para mostrar lo que se puede hacer con Winston, una donde se imprime todo en consola y otra donde se guardan todos los eventos en un archivo .log, ademas de que se hace uso de la sentencia Try-Catch para que la API siga en ejecución despues de un error de ejecución.

**En el archivo app.js se encuentra la API y el uso del logger, en el archivo logger.js se define y configura.**

---

## Instalación
**Para poder ejecutar el código se necesita tener instalado Node.js**

### Paso 1
Instalar las dependencias de la aplicación.
```bash
npm install
```

### Paso 2
Iniciar la aplicación.
```bash
node app.js
```