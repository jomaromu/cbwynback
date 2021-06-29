"use strict";
const api = require('../src/funds_transfer_api').funds_transfer_api;
let internalConfig = process.env.CONFIG_FILE;
if (internalConfig == null) {
    internalConfig = "credentials.json";
}
const assert = require('assert');
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const authCredentials = require('../' + internalConfig);
let StatusCode = "";
const funds_transfer_api = new api(authCredentials);
// path invoked is '/visadirect/fundstransfer/v1/pullfundstransactions';
it('pullfunds Execution', (done) => {
    funds_transfer_api.pullfunds(getParameters())
        .then(function (result) {
        // Put your custom logic here
        console.log('\n Response: ' + JSON.stringify(result.response));
        console.log('\n Response Status: ' + JSON.stringify(result.response.statusCode));
        StatusCode = JSON.stringify(result.response.statusCode);
        console.log('\n--------------- Above product is Visa Direct ---------------');
        console.log('\n--------------- API is Funds Transfer Api ---------------');
        console.log('\n--------------- EndPoint is pullfunds ---------------');
        console.log('\n\n');
        done();
    })
        .catch(function (error) {
        console.log('\n Response: ' + JSON.stringify(error.response));
        console.log('\n Response Status: ' + JSON.stringify(error.response.statusCode));
        StatusCode = JSON.stringify(error.response.statusCode);
        console.log('\n--------------- Above product is Visa Direct ---------------');
        console.log('\n--------------- API is Funds Transfer Api ---------------');
        console.log('\n--------------- EndPoint is pullfunds ---------------');
        console.log('\n\n');
        done();
    });
}).timeout(10000);
it('pullfunds StatusCode', function () {
    // assert.equal(-1, [1,2,3].indexOf(4));
    assert.equal(StatusCode.startsWith('2'), true);
});
function getParameters() {
    const parameters = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    parameters.payload = {
        "businessApplicationId": "AA",
        "cpsAuthorizationCharacteristicsIndicator": "Y",
        "senderCardExpiryDate": "2015-10",
        "amount": "124.02",
        "acquirerCountryCode": "840",
        "retrievalReferenceNumber": "330000550002",
        "cardAcceptor": {
            "idCode": "ABCD1234ABCD123",
            "address": {
                "county": "081",
                "country": "USA",
                "state": "CA",
                "zipCode": "94404"
            },
            "terminalId": "ABCD1234",
            "name": "Visa Inc. USA-Foster City"
        },
        "acquiringBin": "408999",
        "systemsTraceAuditNumber": "451004",
        "nationalReimbursementFee": "11.22",
        "senderCurrencyCode": "USD",
        "cavv": "0700100038238906000013405823891061668252",
        "foreignExchangeFeeTransaction": "11.99",
        "addressVerificationData": {
            "postalCode": "12345",
            "street": "XYZ St"
        },
        "senderPrimaryAccountNumber": "4895142232120006",
        "surcharge": "11.99"
    };
    parameters.payload.localTransactionDateTime = Date.now();
    return parameters;
}
