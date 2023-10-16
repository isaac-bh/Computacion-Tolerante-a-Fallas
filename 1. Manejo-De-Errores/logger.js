const { createLogger, transports, format } = require("winston");


const logger = createLogger({
  // Nivel de advertencias minimas que serán pasadas a través del logger.
  level: "debug",
  
  transports: [
    // Salida del logger por archivo.
    new transports.File({
      filename: "debug.log",
      format: format.combine(
        format.timestamp(),
        format.json(),
      ),
    }),
    // Salida del logger por consola, se usará un formato especial.
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.align(),
        format.printf((msj) => {
          const { timestamp, level, message } = msj;
          const time = timestamp.slice(0, 19).replace('T', ' ');
          return `${time} [${level}]: ${message}`;
        })
      ),
    }),
  ],
});


module.exports = logger;