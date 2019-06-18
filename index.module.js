if (process.env.NODE_ENV === 'production') {
  module.exports = require('./es/lanning.production.min.js');
} else {
  module.exports = require('./es/lanning.development.js');
}
