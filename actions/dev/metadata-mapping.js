'use strict'

const AssetAPI = require('../asset-api');
const EDSSheetAPI = require('../eds-sheet-api');

async function main (params) {
  //console.log(params);

  if(!params.hasOwnProperty('payloadPath')) {
    return {
      statusCode: 400,
      body: 'missing PayloadPath as url parameter'
    }
  }

  var AEM_URL;

  if(params.hasOwnProperty('origin')) {
    AEM_URL = params.origin;
  }
  
  if(params.__ow_headers.hasOwnProperty('origin')) {
    AEM_URL = params.__ow_headers.origin;
  }

  if(!AEM_URL) {
    return {
      statusCode: 400,
      body: 'missing origin in url parameter or header'
    }
  }

  // remove extra path if this is AEM Launcher initiated on asset metadata change
  const payloadPath = params.payloadPath.replace('/jcr:content/metadata', '');

  const assetAPIObj = new AssetAPI(AEM_URL, params.AEM_CREDENTIAL, params.AEM_ASSET_API_FIXED_PATH);
  const fileName = assetAPIObj.getFullFileNameFromPath(payloadPath);

  // get metadata map
  const edsSheetApiObj = new EDSSheetAPI(params.META_DATA_MAP_SOURCE);
  await edsSheetApiObj.init();

  const foundMetadataMapObj = edsSheetApiObj.getObjectByNameValue('file-name', fileName);

  if(foundMetadataMapObj) {
    // write mapping metadata value back to AEM
    for (const property in foundMetadataMapObj) {
      const ret = await assetAPIObj.setAssetMetadata(payloadPath, property, foundMetadataMapObj[property]);
    }
  }

  return { statusCode: 200 };
}

exports.main = main