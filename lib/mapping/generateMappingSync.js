'use strict';

const _ = require('lodash');
const rcs = require('rcs-core');
const path = require('path');
const json = require('json-extra');

/**
 * The synchronous method of generateMapping
 */
const generateMappingSync = (pathString, options) => {
  let fileName = 'renaming_map';
  let fileNameExt = '.json';
  let mappingName = 'CSS_NAME_MAPPING';

  const optionsDefault = {
    cssMapping: true,
    cssMappingMin: false,
    extended: false,
    json: true,
    origValues: true,
    isSelectors: true,
    overwrite: false,
  };

  options = _.merge(optionsDefault, options);

  if (options.cssMappingMin) {
    options.origValues = false;
    mappingName = 'CSS_NAME_MAPPING_MIN';
    fileName = `${fileName}_min`;
  }

  if (typeof options.cssMappingMin === 'string') {
    mappingName = options.cssMappingMin;
    fileName = options.cssMappingMin;
  }

  if (typeof options.cssMapping === 'string') {
    fileName = options.cssMapping;
  }

  const cssMappingArray = rcs.selectorLibrary.getAll({
    extend: options.extended,
    getRenamedValues: !options.origValues,
    addSelectorType: options.isSelectors,
  });

  const cssMappingJsonString = json.check(cssMappingArray) ? cssMappingArray : json.stringify(cssMappingArray, null, '\t');
  let writeData = cssMappingJsonString;
  const newPath = path.join(pathString, fileName);

  // no json
  if (!options.json) {
    writeData = `var ${mappingName} = ${cssMappingJsonString};`;
    fileNameExt = '.js';
  }

  rcs.helper.saveSync(`${newPath}${fileNameExt}`, writeData, { overwrite: options.overwrite });
}; // /generateMappingSync

module.exports = generateMappingSync;
