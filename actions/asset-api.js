const path = require('path');

class AssetAPI {
  constructor(AEM_URL, AEM_CREDENTIAL, AEM_ASSET_API_FIXED_PATH) {
    this.AEM_URL = AEM_URL;
    this.AEM_CREDENTIAL = AEM_CREDENTIAL;
    this.AEM_BASIC_AUTH = 'Basic ' + btoa(this.AEM_CREDENTIAL);
    this.AEM_ASSET_API_FIXED_PATH = AEM_ASSET_API_FIXED_PATH;
    this.AEM_HEADERS = {
      'Content-Type': 'application/json',
      'Authorization': this.AEM_BASIC_AUTH
    }
  }

  async getAssetJson(assetPath) { 
    const AEM_ASSET_API_FULL_PATH = this.AEM_URL + assetPath.replace('/content/dam', this.AEM_ASSET_API_FIXED_PATH) + '.json';
    
    const res = await fetch(AEM_ASSET_API_FULL_PATH, { method: 'GET', headers: this.AEM_HEADERS});
    const resJson = await res.json();

    return resJson;
  }

  async setAssetMetadata(assetPath, metadataName, metadataValue) { 
    const AEM_ASSET_API_FULL_PATH = this.AEM_URL + assetPath.replace('/content/dam', this.AEM_ASSET_API_FIXED_PATH);
    const body = {
      class: 'asset',
      properties: {
        metadata: {}
      }
    };
    
    body.properties.metadata[metadataName] = metadataValue;
    
    const res = await fetch(AEM_ASSET_API_FULL_PATH, { method: 'PUT', headers: this.AEM_HEADERS, body: JSON.stringify(body)});
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