const proj4 = require('proj4');

module.exports = {
  convert,
};


function convert(fromProjection, toProjection, coords) {
  return proj4(fromProjection, toProjection, coords);
}
