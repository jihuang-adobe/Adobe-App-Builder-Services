class QueryBuilderAPI {
  constructor(AEM_URL, AEM_CREDENTIAL, AEM_QUERY_BUILDER_API_FIXED_PATH) {
    this.AEM_QUERY_BUILDER_API_FULL_PATH = AEM_URL + AEM_QUERY_BUILDER_API_FIXED_PATH;
    this.AEM_HEADERS = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(AEM_CREDENTIAL)
    }
  }

  async sendQuery(queryJSON) {
    const res = await fetch(this.AEM_QUERY_BUILDER_API_FULL_PATH + '?' + new URLSearchParams(queryJSON), { method: 'GET', headers: this.AEM_HEADERS});
    const resJSON = await res.json();

    return resJSON;
  }

  async getSmartTags(assetPath) { 
    return await this.sendQuery ({
      'path': assetPath + '/jcr:content/metadata/predictedTags',
      'p.limit': -1,
      'p.hits': 'selective',
      'p.properties': 'name'
    });
  }
}

module.exports = QueryBuilderAPI; 