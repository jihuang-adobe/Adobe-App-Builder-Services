'use strict'

const AssetAPI = require('../asset-api');

async function main (params) {
  if(!params.hasOwnProperty('payloadPath')) {
    return {
      statusCode: 400,
      body: 'missing PayloadPath as url parameter'
    }
  }

  // remove extra path if this is AEM Launcher initiated on asset metadata change
  const payloadPath = params.payloadPath.replace('/jcr:content/metadata', '');

  const assetAPIObj = new AssetAPI(params.AEM_URL, params.AEM_CREDENTIAL, params.AEM_ASSET_API_FIXED_PATH);
  
  //console.log(await assetAPIObj.getAssetJson(params.payloadPath));
  const fileName = assetAPIObj.getFileNameFromPath(payloadPath);
  const ret = await assetAPIObj.setAssetMetadata(payloadPath, 'contentOwner', fileName);

  return { statusCode: 200 };
}

exports.main = main