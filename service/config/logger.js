// logger.js
import winston from 'winston';

// Configure winston logger
const logger = winston.createLogger({
    level: 'info', // log level (info, error, warn, etc.)
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Logs to the console
        new winston.transports.File({ filename: 'app.log' }) // Logs to a file
    ],
});

export default logger;
