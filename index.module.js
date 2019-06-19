if (process.env.NODE_ENV === 'production') {
  module.exports = require('./es/lanning.production.js');
} else {
  module.exports = require('./es/lanning.development.js');
}
