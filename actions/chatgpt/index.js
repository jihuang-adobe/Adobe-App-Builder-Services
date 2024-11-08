'use strict'

async function main (params) {
  const responseHeaders = {
    'Access-Control-Allow-Origin': params.__ow_headers.origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
    'Content-Type': 'application/json'
  };

  // return if PREFLIGHT/OPTIONS
  if (params.__ow_method.toLowerCase() == "options") {
    return {
      statusCode: 200,
      headers: responseHeaders
    }
  }

  console.log('hi');

  if(!params.hasOwnProperty('payload')) {
    return {
      statusCode: 400,
      headers : responseHeaders,
      body: {error: 'invalid json, need { payload: { seedtext: {}, message: {}}}'}
    }
  }

  if(!params.payload.hasOwnProperty('seedtext')) {
    return {
      statusCode: 400,
      headers : responseHeaders,
      body: {error: 'invalid json.  missing payload.seedtext'}
    }
  }

  if(!params.payload.hasOwnProperty('message')) {
    return {
      statusCode: 400,
      headers : responseHeaders,
      body: {error: 'invalid json.  missing payload.message'}
    }
  }

  const CHATGPT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
  const CHATGPT_API_SECRET_KEY = params.CHATGPT_SECRET_KEY;
  const CHATGPT_API_HEADER = {
    'Authorization': 'Bearer ' + CHATGPT_API_SECRET_KEY,
    'Content-Type': 'application/json'
  }
  const CHATGPT_API_BODY = {
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: JSON.stringify(params.payload.seedtext)
      },
      {
          role: 'user',
          content: params.payload.message
      }
    ],
    model: 'gpt-3.5-turbo'
  }

  //console.log(JSON.stringify(CHATGPT_API_BODY));

  const res = await fetch(CHATGPT_API_ENDPOINT, { method: 'POST', headers: CHATGPT_API_HEADER, body: JSON.stringify(CHATGPT_API_BODY)});

  const resJson = await res.json();

  const response = {
    statusCode: 200,
    headers: responseHeaders,
    body: resJson
  }

  return response;
}

exports.main = main