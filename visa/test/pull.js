/*
 * *© Copyright 2018 - 2020 Visa. All Rights Reserved.**
 *
 * NOTICE: The software and accompanying information and documentation (together, the “Software”) remain the property of and are proprietary to Visa and its suppliers and affiliates. The Software remains protected by intellectual property rights and may be covered by U.S. and foreign patents or patent applications. The Software is licensed and not sold.*
 *
 *  By accessing the Software you are agreeing to Visa's terms of use (developer.visa.com/terms) and privacy policy (developer.visa.com/privacy).In addition, all permissible uses of the Software must be in support of Visa products, programs and services provided through the Visa Developer Program (VDP) platform only (developer.visa.com). **THE SOFTWARE AND ANY ASSOCIATED INFORMATION OR DOCUMENTATION IS PROVIDED ON AN “AS IS,” “AS AVAILABLE,” “WITH ALL FAULTS” BASIS WITHOUT WARRANTY OR  CONDITION OF ANY KIND. YOUR USE IS AT YOUR OWN RISK.** All brand names are the property of their respective owners, used for identification purposes only, and do not imply product endorsement or affiliation with Visa. Any links to third party sites are for your information only and equally  do not constitute a Visa endorsement. Visa has no insight into and control over third party content and code and disclaims all liability for any such components, including continued availability and functionality. Benefits depend on implementation details and business factors and coding steps shown are exemplary only and do not reflect all necessary elements for the described capabilities. Capabilities and features are subject to Visa’s terms and conditions and may require development,implementation and resources by you based on your business and operational details. Please refer to the specific API documentation for details on the requirements, eligibility and geographic availability.*
 *
 * This Software includes programs, concepts and details under continuing development by Visa. Any Visa features,functionality, implementation, branding, and schedules may be amended, updated or canceled at Visa’s discretion.The timing of widespread availability of programs and functionality is also subject to a number of factors outside Visa’s control,including but not limited to deployment of necessary infrastructure by issuers, acquirers, merchants and mobile device manufacturers.*
 *
 */

'use strict';
var api = require('./funds_transfer_api').funds_transfer_api;
var internalConfig = process.env.CONFIG_FILE;
if(internalConfig==null){
    internalConfig = "credentials.json";
}
var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;
var authCredentials = require('../' + internalConfig);
var statusId = "";
var StatusCode ="";
var funds_transfer_api = new api(authCredentials);
it('pullfundstransactions Execution', (done) => {
funds_transfer_api.pullfunds(getParameters())
    .then(function (result) {
        statusId = result.response.body;
        console.log('\n\n' + statusId);
        // path invoked is '/visadirect/fundstransfer/v1/pullfundstransactions/{statusIdentifier}';
        funds_transfer_api.pullfundstransactions(getParameters())
            .then(function (result) {
                // Put your custom logic here
                console.log('\n Response: ' + JSON.stringify(result.response));
                console.log('\n Response Status: ' + JSON.stringify(result.response.statusCode));
                StatusCode= JSON.stringify(result.response.statusCode);
                console.log('\n--------------- Above product is Visa Direct ---------------');
                console.log('\n--------------- API is Funds Transfer Api ---------------');
                console.log('\n--------------- EndPoint is pullfundstransactions ---------------');
                console.log('\n\n');
                done();
            })
            .catch(function (error) {
                console.log('\n Response: ' + JSON.stringify(error.response));
                console.log('\n Response Status: ' + JSON.stringify(error.response.statusCode));
                StatusCode= JSON.stringify(error.response.statusCode);
                console.log('\n--------------- Above product is Visa Direct ---------------');
                console.log('\n--------------- API is Funds Transfer Api ---------------');
                console.log('\n--------------- EndPoint is pullfundstransactions ---------------');
                console.log('\n\n');
                done();
            });

        function getParameters() {
            var parameters = {

                "Accept": "application/json",
                "Content-Type": "application/json",
                "StatusIdentifier" : statusId
            };
            parameters.payload = {};

            return parameters;
        }
    })
    .catch(function (error) {
        console.log('\n Response: ' + JSON.stringify(error.response));
        console.log('\n Response Status: ' + JSON.stringify(error.response.statusCode));
        console.log('\n--------------- Above product is Visa Direct ---------------');
        console.log('\n--------------- API is Funds Transfer Api ---------------');
        console.log('\n--------------- EndPoint is pullfunds ---------------');
        console.log('\n\n');
        done();
    });
}).timeout(10000);

it('pullfundstransactions StatusCode', function(){
    // assert.equal(-1, [1,2,3].indexOf(4));
    assert.equal(StatusCode.startsWith(2),true);
});
function getParameters() {
    var parameters = {
        "X-TRANSACTION-TIMEOUT-MS" : "1",
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    parameters.payload = {
        "businessApplicationId": "AA",
        "cpsAuthorizationCharacteristicsIndicator": "Y",
        "senderCardExpiryDate": "2015-10",
        "amount": "124.02",
        "acquirerCountryCode": "840",
        "retrievalReferenceNumber": "330000550000",
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
        "systemsTraceAuditNumber": "451001",
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
