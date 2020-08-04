const debug = require('debug')('node:asyncerrorhandle');
module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      debug('Async Error Middleware caught');
      next(error);
    }
  }
}