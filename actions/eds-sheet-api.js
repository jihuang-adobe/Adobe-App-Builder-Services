class EDSSheetAPI {
  constructor(JsonUrl) {
    this.JSON_URL = JsonUrl;
  }

  async init() {
    const metadataMap = await fetch(this.JSON_URL);
    this.METADATA_MAP_JSON = await metadataMap.json();
    //return this.METADATA_MAP_JSON;
  }

  getObjectByNameValue(name, value) {
    return this.METADATA_MAP_JSON.data.filter(
      function(item){ return item[name] == value }
    )[0];
  }
}

module.exports = EDSSheetAPI; 