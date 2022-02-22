#! /usr/bin/env node
const { program } = require('commander');
const { convert } = require('../lib/convert');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
program
  .name("coord")
  .usage(
    `-e <easting> -n <northing> -z <zone> -i <input> -o [output] `)
  .version(require('../package.json').version)
  .option('-e, --easting <easting>', 'UTM Easting')
  .option('-n, --northing <northing>', 'UTM Northing')
  .option('-z, --zone <zone>', 'zone number')
  .option('-i, --input <input>', 'input file path')
  .option('-o, --output [output]',
    'output file path default to current folder: ./converted.geo.json',
    `${process.cwd()}/converted.geo.json`)
  .addHelpText('after', `
  Example call:
    $ coord -e 661055.92 -n 3295127.23 --zone 48 -i ../example/boundary.geo.json -o ./converted.geo.json`)
  .showHelpAfterError()
  .action((argv, options, command) => {
    const { easting, northing, zone, input, output } = argv;
    checkArgs(argv)
    const WGS84_TEXT = '+proj=longlat +ellps=WGS84'
    const UTM_TARGET = `+proj=utm +zone=${zone} +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs`
    let data;
    try {
      data = require(path.resolve(input));
    } catch (e) {
      console.error(`Input file not found: ${input}`.underline.red);
      process.exit(1);
    }
    try {
      data.features.forEach(item => {
        item.geometry.coordinates[0].forEach(coord => {
          const [x, y] = convert(
            UTM_TARGET,
            WGS84_TEXT,
            [coord[0] + Number(easting), coord[1] + Number(northing)]
          );
          coord[0] = x;
          coord[1] = y;
        })
      })
      const jsonString = JSON.stringify(data, null, 2);
      fs.writeFile(output, jsonString, () => {
        console.log(colors.rainbow(`Convert succeeded. File saved in: ${output}`))
      });
    } catch (error) {
      throw new Error(error);
    }
  })
  .parse(process.argv);


function checkArgs(argv) {
  if (!argv.easting || !argv.northing || !argv.zone || !argv.input || !argv.output) {
    console.error('Missing arguments'.underline.red);
    program.help();
  }
}
