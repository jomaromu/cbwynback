"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cryypto = require('crypto');
const getXPayToken = ((resourcePath, apiKey, postBody, sharedSecret) => {
    const queryParams = 'apikey=' + apiKey;
    const timestamp = Math.floor(Date.now() / 1000);
    const preHashString = timestamp + resourcePath + queryParams + postBody;
    const hashString = cryypto.createHmac('SHA256', sharedSecret).update(preHashString).digest('hex');
    const xPayToken = 'xv2:' + timestamp + ':' + hashString;
    return xPayToken;
});
exports.default = getXPayToken;
