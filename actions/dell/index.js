'use strict'

const AssetAPI = require('../asset-api');

async function main (params) {
  if(!params.hasOwnProperty('payloadPath')) {
    return {
      statusCode: 400,
      body: 'missing PayloadPath as url parameter'
    }
  }

  const assetAPIObj = new AssetAPI(params.AEM_URL, params.AEM_CREDENTIAL, params.AEM_ASSET_API_FIXED_PATH);
  
  //console.log(await assetAPIObj.getAssetJson(params.payloadPath));
  const fileName = assetAPIObj.getFileNameFromPath(params.payloadPath);
  const ret = await assetAPIObj.setAssetMetadata(params.payloadPath, 'contentOwner', fileName);

  return { statusCode: 200 };
}

exports.main = main