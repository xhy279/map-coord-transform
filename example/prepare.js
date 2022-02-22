const data = require('./boundary.geo.json');
const fs = require('fs');

const boundaryProperty2 = {
  type: 'FeatureCollection',
  name: 'boundary',
  crs: {
    type: 'name',
    properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
  },
  features: data.features.filter(feature => {
    return feature.properties.property == 2
  })
}
const boundaryProperty0 = {
  type: 'FeatureCollection',
  name: 'boundary',
  crs: {
    type: 'name',
    properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
  },
  features: data.features.filter(feature => {
    return feature.properties.property == 0
  })
}


fs.writeFile('boundary-property-2.geo.json', JSON.stringify(boundaryProperty2), function (err) {
  if (err) {
    console.log(err)
    throw err;
  }
})

fs.writeFile('boundary-property-0.geo.json', JSON.stringify(boundaryProperty0), function (err) {
  if (err) {
    console.log(err)
    throw err;
  }
})

