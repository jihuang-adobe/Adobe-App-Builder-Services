const path = require('path');

class AssetAPI {
  constructor(AEM_URL, AEM_CREDENTIAL, AEM_ASSET_API_FIXED_PATH) {
    this.AEM_URL = AEM_URL;
    this.AEM_ASSET_API_FIXED_PATH = AEM_ASSET_API_FIXED_PATH;
    this.AEM_HEADERS = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(AEM_CREDENTIAL)
    }
  }

  getAEMAssetAPIFullPath(assetPath) {
    return this.AEM_URL + assetPath.replace('/content/dam', this.AEM_ASSET_API_FIXED_PATH);
  }

  async getAssetJson(assetPath) { 
    const res = await fetch(this.getAEMAssetAPIFullPath(assetPath) + '.json', { method: 'GET', headers: this.AEM_HEADERS});
    const resJson = await res.json();

    return resJson;
  }

  async setAssetMetadata(assetPath, metadataName, metadataValue) {
    const body = {
      class: 'asset',
      properties: {
        metadata: {}
      }
    };
    
    body.properties.metadata[metadataName] = metadataValue;
    
    const res = await fetch(this.getAEMAssetAPIFullPath(assetPath), { method: 'PUT', headers: this.AEM_HEADERS, body: JSON.stringify(body)});
    const resJson = await res.json();
    
    return resJson;
  }

  getFullFileNameFromPath(assetPath) {
    return path.parse(assetPath).base;
  }

  getFileNameFromPath(assetPath) {
    return path.parse(assetPath).name;
  }

  getFileExtensionFromPath(assetPath) {
    return path.parse(assetPath).ext;
  }
}

module.exports = AssetAPI; 