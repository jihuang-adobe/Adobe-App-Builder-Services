'use strict'

const AssetAPI = require('../asset-api');
const QueryBuilderAPI = require('../query-builder-api');

async function main (params) {
  //console.log(params);

  if(!params.hasOwnProperty('payloadPath')) {
    return {
      statusCode: 400,
      body: 'missing PayloadPath as url parameter'
    }
  }

  // remove extra path if this is AEM Launcher initiated on asset metadata change
  const payloadPath = params.payloadPath.replace('/jcr:content/metadata', '');

  const assetAPIObj = new AssetAPI(params.AEM_URL, params.AEM_CREDENTIAL, params.AEM_ASSET_API_FIXED_PATH);
  const queryBuilderAPIObj = new QueryBuilderAPI(params.AEM_URL, params.AEM_CREDENTIAL, params.AEM_QUERY_BUILDER_API_FIXED_PATH);
  const smartTagsJSON = await queryBuilderAPIObj.getSmartTags(params.payloadPath);
  const smartTagsArray = smartTagsJSON.hits.map(hit => hit.name);
  
  //console.log(await assetAPIObj.getAssetJson(params.payloadPath));
  const fileName = assetAPIObj.getFileNameFromPath(payloadPath);
  const ret = await assetAPIObj.setAssetMetadata(
    payloadPath,
    'contentOwner',
    `File Name: ${fileName}
    Smart Tags: ${smartTagsArray.join(', ')}
    `
  );

  //console.log(fileName);
  //console.log(ret);

  return { statusCode: 200 };
}

exports.main = main