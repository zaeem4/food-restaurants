const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const infoFilter = format((info, opts) => {
  return info.level === 'info' ? info : false;
});

module.exports = createLogger({
  transports: [
    new transports.DailyRotateFile({
      filename: `logs/info-%DATE%.log`,
      level: 'info',
      format: format.combine(
        infoFilter(),
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
      ),
    }),
  ],
});
