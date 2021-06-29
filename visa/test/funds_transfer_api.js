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

/*jshint -W069 */
/**
 *
 * @class funds_transfer_api
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var funds_transfer_api = (function () {
    'use strict';

    var request = require('request');
    var Q = require('q');
    var randomstring = require('randomstring');
    var expect = require('chai').expect;
    var req = request.defaults();
    var fs = require('fs');
    var proxy = "";
    var pathLib = require('path');
    var privateKey = "";
    const jose = require('node-jose');


    function funds_transfer_api(options) {

        if (typeof options !== 'object') {
            throw new Error('"authCredientials" object is missing. Constructor should be called with a json object');
        }

        var domain = (typeof options === 'object') ? options.domain : options;
        // this.domain = domain ? domain : 'https://sandbox.api.visa.com';
        this.domain = domain ? domain : 'https://sandbox.api.visa.com/visadirect/fundstransfer/v1/pullfundstransactions';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }

        var missingValues = [];

        if (options.userId) {
            this.userId = options.userId;
        } else {
            missingValues.push('userId');
        }

        if (options.userId) {
            this.password = options.password;
        } else {
            missingValues.push('password');
        }

        if (options.key) {
            this.keyFile = options.key;
        } else {
            missingValues.push('key');
        }
        if (options.proxy) {
            this.proxy = options.proxy;
        }
        if (options.mleKeyId) {
            this.mleKeyId = options.mleKeyId;

        } else {
            missingValues.push('mleKeyId');
        }
        if (options.mlePublicKeyPath) {
            this.mlePublicKeyPath = options.mlePublicKeyPath;
        } else {
            missingValues.push('mlePublicKeyPath');
        }
        if (options.mlePrivateKeyPath) {
            this.mlePrivateKeyPath = options.mlePrivateKeyPath;
            privateKey = this.mlePrivateKeyPath;
        } else {
            missingValues.push('mlePrivateKeyPath');
        }


        if (options.cert) {
            this.certificateFile = options.cert;
        } else {
            missingValues.push('cert');
        }

        if (missingValues.length > 0) {
            var errorString = missingValues.join(", ");
            if (missingValues.length === 1) {
                throw new Error(errorString + " is missing in authCredientials.");
            } else {
                throw new Error(errorString + " are missing in authCredientials.");
            }
        }
    }

    /**
     * Create Multi Push Funds Transaction
     * @method
     * @name funds_transfer_api#multipushfunds
     * @param {string} xClientTransactionId -
     * @param {} xClientTransactionId -
     * @param {} multipushfundsPOSTPayload - Resource body for Create Multi Push Funds Transaction
     *
     */
    funds_transfer_api.prototype.multipushfunds = function (parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/visadirect/fundstransfer/v1/multipushfundstransactions';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        var proxy = this.proxy;
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['keyId'] = this.mleKeyId;
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        /*if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }*/
        headers['x-client-transaction-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        });

        if(parameters['X-TRANSACTION-TIMEOUT-MS']!== undefined){
            headers['X-TRANSACTION-TIMEOUT-MS']=  parameters['X-TRANSACTION-TIMEOUT-MS'];
        }
        if(fs.existsSync(this.keyFile)) {
        } else {
            this.keyFile = pathLib.join(__dirname,  this.keyFile);

        }
        if(fs.existsSync(this.certificateFile)) {
        } else {
            this.certificateFile = pathLib.join(__dirname,  this.certificateFile);

        }
        if(fs.existsSync(this.mlePublicKeyPath)) {
        } else {
            this.mlePublicKeyPath = pathLib.join(__dirname,  this.mlePublicKeyPath);

        }
        if(fs.existsSync(privateKey)) {
        } else {
            privateKey= pathLib.join(__dirname,  privateKey);

        }
        encrypt(this.mlePublicKeyPath, this.mleKeyId, body).then(success => {
            var req = {
                method: 'POST',
                uri: domain + path,
                qs: queryParameters,
                key: fs.readFileSync(this.keyFile),
                cert: fs.readFileSync(this.certificateFile),
                headers: headers,
                body: success
            };
            if (this.proxy != "") {
                request = request.defaults({
                    'proxy': this.proxy
                });
            }
            if (Object.keys(form).length > 0) {
                req.form = form;
            }
            if (typeof(body) === 'object' && !(body instanceof Buffer)) {
                req.json = true;
            }


            request(req, function(error, response, body) {
                if (error) {
                    console.log("error " + JSON.stringify(error));
                    deferred.reject(error);
                } else {
                    if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {

                        }
                    }
                    var responseBody = JSON.stringify(body);
                    if (responseBody.indexOf('encData') != -1) {
                        decrypt(privateKey, body).then(success => {
                            response.body = success;
                            if (response.statusCode === 204) {
                                deferred.resolve({
                                    response: response
                                });
                            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                                deferred.resolve({
                                    response: response,
                                    body: success
                                });
                            } else {
                                deferred.reject({
                                    response: response,
                                    body: body
                                });
                            }

                        })
                            .catch(err => console.log("decryption error"));
                    } else {
                        deferred.reject({
                            response: response,
                            body: body
                        });

                    }

                }
            });

        })
            .catch(err => console.log("encryption error"));

        return deferred.promise;
    };
    /**
     * Create Pull Funds Transaction
     * @method
     * @name funds_transfer_api#pullfunds
     * @param {string} xClientTransactionId -
     * @param {} pullfundsPOSTPayload - Resource body for Create Pull Funds Transaction
     *
     */
    funds_transfer_api.prototype.pullfunds = function (parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/visadirect/fundstransfer/v1/pullfundstransactions';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['keyId'] = this.mleKeyId;
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        /*if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }*/
        headers['x-client-transaction-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        });
        if(parameters['X-TRANSACTION-TIMEOUT-MS']!== undefined){
            headers['X-TRANSACTION-TIMEOUT-MS']=  parameters['X-TRANSACTION-TIMEOUT-MS'];
        }
        if(fs.existsSync(this.keyFile)) {
        } else {
            this.keyFile = pathLib.join(__dirname,  this.keyFile);

        }
        if(fs.existsSync(this.certificateFile)) {
        } else {
            this.certificateFile = pathLib.join(__dirname,  this.certificateFile);

        }
        if(fs.existsSync(this.mlePublicKeyPath)) {
        } else {
            this.mlePublicKeyPath = pathLib.join(__dirname,  this.mlePublicKeyPath);

        }
        if(fs.existsSync(privateKey)) {
        } else {
            privateKey= pathLib.join(__dirname,  privateKey);

        }
        encrypt(this.mlePublicKeyPath, this.mleKeyId, body).then(success => {
            var req = {
                method: 'POST',
                uri: domain + path,
                qs: queryParameters,
                key: fs.readFileSync(this.keyFile),
                cert: fs.readFileSync(this.certificateFile),
                headers: headers,
                body: success
            };
            if (this.proxy != "") {
                request = request.defaults({
                    'proxy': this.proxy
                });
            }
            if (Object.keys(form).length > 0) {
                req.form = form;
            }
            if (typeof(body) === 'object' && !(body instanceof Buffer)) {
                req.json = true;
            }


            request(req, function(error, response, body) {
                if (error) {
                    console.log("error " + JSON.stringify(error));
                    deferred.reject(error);
                } else {
                    if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {

                        }
                    }
                    var responseBody = JSON.stringify(body);
                    if (responseBody.indexOf('encData') != -1) {
                        decrypt(privateKey, body).then(success => {
                            response.body = success;
                            if (response.statusCode === 204) {
                                deferred.resolve({
                                    response: response
                                });
                            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                                deferred.resolve({
                                    response: response,
                                    body: success
                                });
                            } else {
                                deferred.reject({
                                    response: response,
                                    body: body
                                });
                            }

                        })
                            .catch(err => console.log("decryption error"));
                    } else {
                        deferred.reject({
                            response: response,
                            body: body
                        });

                    }

                }
            });

        })
            .catch(err => console.log("encryption error"));

        return deferred.promise;
    };
    /**
     * Create Reverse Funds Transaction
     * @method
     * @name funds_transfer_api#reversefunds
     * @param {string} xClientTransactionId -
     * @param {} reversefundsPOSTPayload - Resource body for Create Reverse Funds Transaction
     *
     */
    funds_transfer_api.prototype.reversefunds = function (parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/visadirect/fundstransfer/v1/reversefundstransactions';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['keyId'] = this.mleKeyId;
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        /*if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }*/
        headers['x-client-transaction-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        });
        if(parameters['X-TRANSACTION-TIMEOUT-MS']!== undefined){
            headers['X-TRANSACTION-TIMEOUT-MS']=  parameters['X-TRANSACTION-TIMEOUT-MS'];
        }
        if(fs.existsSync(this.keyFile)) {
        } else {
            this.keyFile = pathLib.join(__dirname,  this.keyFile);

        }
        if(fs.existsSync(this.certificateFile)) {
        } else {
            this.certificateFile = pathLib.join(__dirname,  this.certificateFile);

        }
        if(fs.existsSync(this.mlePublicKeyPath)) {
        } else {
            this.mlePublicKeyPath = pathLib.join(__dirname,  this.mlePublicKeyPath);

        }
        if(fs.existsSync(privateKey)) {
        } else {
            privateKey= pathLib.join(__dirname,  privateKey);

        }
        encrypt(this.mlePublicKeyPath, this.mleKeyId, body).then(success => {
            var req = {
                method: 'POST',
                uri: domain + path,
                qs: queryParameters,
                key: fs.readFileSync(this.keyFile),
                cert: fs.readFileSync(this.certificateFile),
                headers: headers,
                body: success
            };
            if (this.proxy != "") {
                request = request.defaults({
                    'proxy': this.proxy
                });
            }
            if (Object.keys(form).length > 0) {
                req.form = form;
            }
            if (typeof(body) === 'object' && !(body instanceof Buffer)) {
                req.json = true;
            }


            request(req, function(error, response, body) {
                if (error) {
                    console.log("error " + JSON.stringify(error));
                    deferred.reject(error);
                } else {
                    if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {

                        }
                    }
                    var responseBody = JSON.stringify(body);
                    if (responseBody.indexOf('encData') != -1) {
                        decrypt(privateKey, body).then(success => {
                            response.body = success;
                            if (response.statusCode === 204) {
                                deferred.resolve({
                                    response: response
                                });
                            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                                deferred.resolve({
                                    response: response,
                                    body: success
                                });
                            } else {
                                deferred.reject({
                                    response: response,
                                    body: body
                                });
                            }

                        })
                            .catch(err => console.log("decryption error"));
                    } else {
                        deferred.reject({
                            response: response,
                            body: body
                        });

                    }

                }
            });

        })
            .catch(err => console.log("encryption error"));
        return deferred.promise;
    };
    /**
     * Create Multi Pull Funds Transaction
     * @method
     * @name funds_transfer_api#multipullfunds
     * @param {string} xClientTransactionId -
     * @param {} xClientTransactionId -
     * @param {} multipullfundsPOSTPayload - Resource body for Create Multi Pull Funds Transaction
     *
     */
    funds_transfer_api.prototype.multipullfunds = function (parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/visadirect/fundstransfer/v1/multipullfundstransactions';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['keyId'] = this.mleKeyId;
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

        /*if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }*/
        headers['x-client-transaction-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }); 
        if(parameters['X-TRANSACTION-TIMEOUT-MS']!== undefined){
            headers['X-TRANSACTION-TIMEOUT-MS']=  parameters['X-TRANSACTION-TIMEOUT-MS'];
        }
        if(fs.existsSync(this.keyFile)) {
        } else {
            this.keyFile = pathLib.join(__dirname,  this.keyFile);

        }
        if(fs.existsSync(this.certificateFile)) {
        } else {
            this.certificateFile = pathLib.join(__dirname,  this.certificateFile);

        }
        if(fs.existsSync(this.mlePublicKeyPath)) {
        } else {
            this.mlePublicKeyPath = pathLib.join(__dirname,  this.mlePublicKeyPath);

        }
        if(fs.existsSync(privateKey)) {
        } else {
            privateKey= pathLib.join(__dirname,  privateKey);

        }
        encrypt(this.mlePublicKeyPath, this.mleKeyId, body).then(success => {
            var req = {
                method: 'POST',
                uri: domain + path,
                qs: queryParameters,
                key: fs.readFileSync(this.keyFile),
                cert: fs.readFileSync(this.certificateFile),
                headers: headers,
                body: success
            };
            if (this.proxy != "") {
                request = request.defaults({
                    'proxy': this.proxy
                });
            }
            if (Object.keys(form).length > 0) {
                req.form = form;
            }
            if (typeof(body) === 'object' && !(body instanceof Buffer)) {
                req.json = true;
            }


            request(req, function(error, response, body) {
                if (error) {
                    console.log("error " + JSON.stringify(error));
                    deferred.reject(error);
                } else {
                    if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {

                        }
                    }
                    var responseBody = JSON.stringify(body);
                    if (responseBody.indexOf('encData') != -1) {
                        decrypt(privateKey, body).then(success => {
                            response.body = success;
                            if (response.statusCode === 204) {
                                deferred.resolve({
                                    response: response
                                });
                            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                                deferred.resolve({
                                    response: response,
                                    body: success
                                });
                            } else {
                                deferred.reject({
                                    response: response,
                                    body: body
                                });
                            }

                        })
                            .catch(err => console.log("decryption error"));
                    } else {
                        deferred.reject({
                            response: response,
                            body: body
                        });

                    }

                }
            });

        })
            .catch(err => console.log("encryption error"));

        return deferred.promise;
    };
    /**
     * Read Pull Funds Transaction
     * @method
     * @name funds_transfer_api#pullfundstransactions
     *
     */
    funds_transfer_api.prototype.pullfundstransactions = function (parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var statusIdentifier = parameters['StatusIdentifier'];
        var domain = this.domain;
        var path = '/visadirect/fundstransfer/v1/pullfundstransactions/' + statusIdentifier;

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';
        headers['keyId'] = this.mleKeyId;

        if(fs.existsSync(this.keyFile)) {
        } else {
            this.keyFile = pathLib.join(__dirname,  this.keyFile);

        }
        if(fs.existsSync(this.certificateFile)) {
        } else {
            this.certificateFile = pathLib.join(__dirname,  this.certificateFile);

        }
        if(fs.existsSync(this.mlePublicKeyPath)) {
        } else {
            this.mlePublicKeyPath = pathLib.join(__dirname,  this.mlePublicKeyPath);

        }
        if(fs.existsSync(privateKey)) {
        } else {
            privateKey= pathLib.join(__dirname,  privateKey);

        }
        encrypt(this.mlePublicKeyPath, this.mleKeyId, body).then(success => {
            var req = {
                method: 'GET',
                uri: domain + path,
                qs: queryParameters,
                key: fs.readFileSync(this.keyFile),
                cert: fs.readFileSync(this.certificateFile),
                headers: headers,
                body: success
            };
            if (this.proxy != "") {
                request = request.defaults({
                    'proxy': this.proxy
                });
            }
            if (Object.keys(form).length > 0) {
                req.form = form;
            }
            if (typeof(body) === 'object' && !(body instanceof Buffer)) {
                req.json = true;
            }


            request(req, function(error, response, body) {
                if (error) {
                    console.log("error " + JSON.stringify(error));
                    deferred.reject(error);
                } else {
                    if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {

                        }
                    }
                    var responseBody = JSON.stringify(body);
                    if (responseBody.indexOf('encData') != -1) {
                        decrypt(privateKey, body).then(success => {
                            response.body = success;
                            if (response.statusCode === 204) {
                                deferred.resolve({
                                    response: response
                                });
                            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                                deferred.resolve({
                                    response: response,
                                    body: success
                                });
                            } else {
                                deferred.reject({
                                    response: response,
                                    body: body
                                });
                            }

                        })
                            .catch(err => console.log("decryption error"));
                    } else {
                        deferred.reject({
                            response: response,
                            body: body
                        });

                    }

                }
            });

        })
            .catch(err => console.log("encryption error"));

        return deferred.promise;
    };
    /**
     * Read Reverse Funds Transaction
     * @method
     * @name funds_transfer_api#reversefundstransactions
     *
     */
    funds_transfer_api.prototype.reversefundstransactions = function (parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var statusIdentifier = parameters['StatusIdentifier'];
        var domain = this.domain;
        var path = '/visadirect/fundstransfer/v1/reversefundstransactions/' + statusIdentifier;

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['keyId'] = this.mleKeyId;
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';
        if(fs.existsSync(this.keyFile)) {
        } else {
            this.keyFile = pathLib.join(__dirname,  this.keyFile);

        }
        if(fs.existsSync(this.certificateFile)) {
        } else {
            this.certificateFile = pathLib.join(__dirname,  this.certificateFile);

        }
        if(fs.existsSync(this.mlePublicKeyPath)) {
        } else {
            this.mlePublicKeyPath = pathLib.join(__dirname,  this.mlePublicKeyPath);

        }
        if(fs.existsSync(privateKey)) {
        } else {
            privateKey= pathLib.join(__dirname,  privateKey);

        }
        encrypt(this.mlePublicKeyPath, this.mleKeyId, body).then(success => {
            var req = {
                method: 'POST',
                uri: domain + path,
                qs: queryParameters,
                key: fs.readFileSync(this.keyFile),
                cert: fs.readFileSync(this.certificateFile),
                headers: headers,
                body: success
            };
            if (this.proxy != "") {
                request = request.defaults({
                    'proxy': this.proxy
                });
            }
            if (Object.keys(form).length > 0) {
                req.form = form;
            }
            if (typeof(body) === 'object' && !(body instanceof Buffer)) {
                req.json = true;
            }


            request(req, function(error, response, body) {
                if (error) {
                    console.log("error " + JSON.stringify(error));
                    deferred.reject(error);
                } else {
                    if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {

                        }
                    }
                    var responseBody = JSON.stringify(body);
                    if (responseBody.indexOf('encData') != -1) {
                        decrypt(privateKey, body).then(success => {
                            response.body = success;
                            if (response.statusCode === 204) {
                                deferred.resolve({
                                    response: response
                                });
                            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                                deferred.resolve({
                                    response: response,
                                    body: success
                                });
                            } else {
                                deferred.reject({
                                    response: response,
                                    body: body
                                });
                            }

                        })
                            .catch(err => console.log("decryption error"));
                    } else {
                        deferred.reject({
                            response: response,
                            body: body
                        });

                    }

                }
            });

        })
            .catch(err => console.log("encryption error"));
        return deferred.promise;
    };
    /**
     * Read Multi Pull Funds Transaction
     * @method
     * @name funds_transfer_api#multipullfundstransactions
     *
     */
    funds_transfer_api.prototype.multipullfundstransactions = function (parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var statusIdentifier = parameters['StatusIdentifier'];
        var domain = this.domain;
        var path = '/visadirect/fundstransfer/v1/multipullfundstransactions/' + statusIdentifier;

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['keyId'] = this.mleKeyId;
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';
        if(fs.existsSync(this.keyFile)) {
        } else {
            this.keyFile = pathLib.join(__dirname,  this.keyFile);

        }
        if(fs.existsSync(this.certificateFile)) {
        } else {
            this.certificateFile = pathLib.join(__dirname,  this.certificateFile);

        }
        if(fs.existsSync(this.mlePublicKeyPath)) {
        } else {
            this.mlePublicKeyPath = pathLib.join(__dirname,  this.mlePublicKeyPath);

        }
        if(fs.existsSync(privateKey)) {
        } else {
            privateKey= pathLib.join(__dirname,  privateKey);

        }
        encrypt(this.mlePublicKeyPath, this.mleKeyId, body).then(success => {
            var req = {
                method: 'GET',
                uri: domain + path,
                qs: queryParameters,
                key: fs.readFileSync(this.keyFile),
                cert: fs.readFileSync(this.certificateFile),
                headers: headers,
                body: success
            };
            if (this.proxy != "") {
                request = request.defaults({
                    'proxy': this.proxy
                });
            }
            if (Object.keys(form).length > 0) {
                req.form = form;
            }
            if (typeof(body) === 'object' && !(body instanceof Buffer)) {
                req.json = true;
            }


            request(req, function(error, response, body) {
                if (error) {
                    console.log("error " + JSON.stringify(error));
                    deferred.reject(error);
                } else {
                    if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {

                        }
                    }
                    var responseBody = JSON.stringify(body);
                    if (responseBody.indexOf('encData') != -1) {
                        decrypt(privateKey, body).then(success => {
                            response.body = success;
                            if (response.statusCode === 204) {
                                deferred.resolve({
                                    response: response
                                });
                            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                                deferred.resolve({
                                    response: response,
                                    body: success
                                });
                            } else {
                                deferred.reject({
                                    response: response,
                                    body: body
                                });
                            }

                        })
                            .catch(err => console.log("decryption error"));
                    } else {
                        deferred.reject({
                            response: response,
                            body: body
                        });

                    }

                }
            });

        })
            .catch(err => console.log("encryption error"));
        return deferred.promise;
    };
    /**
     * Create Multi Reverse Funds Transaction
     * @method
     * @name funds_transfer_api#multireversefunds
     * @param {string} xClientTransactionId -
     * @param {} multireversefundsPOSTPayload - Resource body for Create Multi Reverse Funds Transaction
     *
     */
    funds_transfer_api.prototype.multireversefunds = function (parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/visadirect/fundstransfer/v1/multireversefundstransactions';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['keyId'] = this.mleKeyId;
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

       /*if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }*/
        headers['x-client-transaction-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        });
        if(parameters['X-TRANSACTION-TIMEOUT-MS']!== undefined){
            headers['X-TRANSACTION-TIMEOUT-MS']=  parameters['X-TRANSACTION-TIMEOUT-MS'];
        }
        if(fs.existsSync(this.keyFile)) {
        } else {
            this.keyFile = pathLib.join(__dirname,  this.keyFile);

        }
        if(fs.existsSync(this.certificateFile)) {
        } else {
            this.certificateFile = pathLib.join(__dirname,  this.certificateFile);

        }
        if(fs.existsSync(this.mlePublicKeyPath)) {
        } else {
            this.mlePublicKeyPath = pathLib.join(__dirname,  this.mlePublicKeyPath);

        }
        if(fs.existsSync(privateKey)) {
        } else {
            privateKey= pathLib.join(__dirname,  privateKey);

        }

        encrypt(this.mlePublicKeyPath, this.mleKeyId, body).then(success => {
            var req = {
                method: 'POST',
                uri: domain + path,
                qs: queryParameters,
                key: fs.readFileSync(this.keyFile),
                cert: fs.readFileSync(this.certificateFile),
                headers: headers,
                body: success
            };
            if (this.proxy != "") {
                request = request.defaults({
                    'proxy': this.proxy
                });
            }
            if (Object.keys(form).length > 0) {
                req.form = form;
            }
            if (typeof(body) === 'object' && !(body instanceof Buffer)) {
                req.json = true;
            }


            request(req, function(error, response, body) {
                if (error) {
                    console.log("error " + JSON.stringify(error));
                    deferred.reject(error);
                } else {
                    if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {

                        }
                    }
                    var responseBody = JSON.stringify(body);
                    if (responseBody.indexOf('encData') != -1) {
                        decrypt(privateKey, body).then(success => {
                            response.body = success;
                            if (response.statusCode === 204) {
                                deferred.resolve({
                                    response: response
                                });
                            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                                deferred.resolve({
                                    response: response,
                                    body: success
                                });
                            } else {
                                deferred.reject({
                                    response: response,
                                    body: body
                                });
                            }

                        })
                            .catch(err => console.log("decryption error"));
                    } else {
                        deferred.reject({
                            response: response,
                            body: body
                        });

                    }

                }
            });

        })
            .catch(err => console.log("encryption error"));

        return deferred.promise;
    };
    /**
     * Create Push Funds Transaction
     * @method
     * @name funds_transfer_api#pushfunds
     * @param {string} xClientTransactionId -
     * @param {} pushfundsPOSTPayload - Resource body for Create Push Funds Transaction
     *
     */
    funds_transfer_api.prototype.pushfunds = function (parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/visadirect/fundstransfer/v1/pushfundstransactions';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['keyId'] = this.mleKeyId;
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';

       /*if (parameters['x-client-transaction-id'] !== undefined) {
            headers['x-client-transaction-id'] = parameters['x-client-transaction-id'];
        }*/
        headers['x-client-transaction-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        });
        if(parameters['X-TRANSACTION-TIMEOUT-MS']!== undefined){
            headers['X-TRANSACTION-TIMEOUT-MS']=  parameters['X-TRANSACTION-TIMEOUT-MS'];
        }
        if(fs.existsSync(this.keyFile)) {
        } else {
            this.keyFile = pathLib.join(__dirname,  this.keyFile);

        }
        if(fs.existsSync(this.certificateFile)) {
        } else {
            this.certificateFile = pathLib.join(__dirname,  this.certificateFile);

        }
        if(fs.existsSync(this.mlePublicKeyPath)) {
        } else {
            this.mlePublicKeyPath = pathLib.join(__dirname,  this.mlePublicKeyPath);

        }
        if(fs.existsSync(privateKey)) {
        } else {
            privateKey= pathLib.join(__dirname,  privateKey);

        }
        encrypt(this.mlePublicKeyPath, this.mleKeyId, body).then(success => {
            var req = {
                method: 'POST',
                uri: domain + path,
                qs: queryParameters,
                key: fs.readFileSync(this.keyFile),
                cert: fs.readFileSync(this.certificateFile),
                headers: headers,
                body: success
            };
            if (this.proxy != "") {
                request = request.defaults({
                    'proxy': this.proxy
                });
            }
            if (Object.keys(form).length > 0) {
                req.form = form;
            }
            if (typeof(body) === 'object' && !(body instanceof Buffer)) {
                req.json = true;
            }


            request(req, function(error, response, body) {
                if (error) {
                    console.log("error " + JSON.stringify(error));
                    deferred.reject(error);
                } else {
                    if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {

                        }
                    }
                    var responseBody = JSON.stringify(body);
                    if (responseBody.indexOf('encData') != -1) {
                        decrypt(privateKey, body).then(success => {
                            response.body = success;
                            if (response.statusCode === 204) {
                                deferred.resolve({
                                    response: response
                                });
                            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                                deferred.resolve({
                                    response: response,
                                    body: success
                                });
                            } else {
                                deferred.reject({
                                    response: response,
                                    body: body
                                });
                            }

                        })
                            .catch(err => console.log("decryption error"));
                    } else {
                        deferred.reject({
                            response: response,
                            body: body
                        });

                    }

                }
            });

        })
            .catch(err => console.log("encryption error"));
        return deferred.promise;
    };
    /**
     * Read Push Funds Transaction
     * @method
     * @name funds_transfer_api#pushfundstransactions
     *
     */
    funds_transfer_api.prototype.pushfundstransactions = function (parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var statusIdentifier = parameters['StatusIdentifier'];
        var domain = this.domain;
        var path = '/visadirect/fundstransfer/v1/pushfundstransactions/' + statusIdentifier;

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['keyId'] = this.mleKeyId;
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';
        if(fs.existsSync(this.keyFile)) {
        } else {
            this.keyFile = pathLib.join(__dirname,  this.keyFile);

        }
        if(fs.existsSync(this.certificateFile)) {
        } else {
            this.certificateFile = pathLib.join(__dirname,  this.certificateFile);

        }
        if(fs.existsSync(this.mlePublicKeyPath)) {
        } else {
            this.mlePublicKeyPath = pathLib.join(__dirname,  this.mlePublicKeyPath);

        }
        if(fs.existsSync(privateKey)) {
        } else {
            privateKey= pathLib.join(__dirname,  privateKey);

        }
        encrypt(this.mlePublicKeyPath, this.mleKeyId, body).then(success => {
            var req = {
                method: 'GET',
                uri: domain + path,
                qs: queryParameters,
                key: fs.readFileSync(this.keyFile),
                cert: fs.readFileSync(this.certificateFile),
                headers: headers,
                body: success
            };
            if (this.proxy != "") {
                request = request.defaults({
                    'proxy': this.proxy
                });
            }
            if (Object.keys(form).length > 0) {
                req.form = form;
            }
            if (typeof(body) === 'object' && !(body instanceof Buffer)) {
                req.json = true;
            }


            request(req, function(error, response, body) {
                if (error) {
                    console.log("error " + JSON.stringify(error));
                    deferred.reject(error);
                } else {
                    if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {

                        }
                    }
                    var responseBody = JSON.stringify(body);
                    if (responseBody.indexOf('encData') != -1) {
                        decrypt(privateKey, body).then(success => {
                            response.body = success;
                            if (response.statusCode === 204) {
                                deferred.resolve({
                                    response: response
                                });
                            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                                deferred.resolve({
                                    response: response,
                                    body: success
                                });
                            } else {
                                deferred.reject({
                                    response: response,
                                    body: body
                                });
                            }

                        })
                            .catch(err => console.log("decryption error"));
                    } else {
                        deferred.reject({
                            response: response,
                            body: body
                        });

                    }

                }
            });

        })
            .catch(err => console.log("encryption error"));
        return deferred.promise;
    };
    /**
     * Read Multi Push Funds Transaction
     * @method
     * @name funds_transfer_api#multipushfundstransactions
     *
     */
    funds_transfer_api.prototype.multipushfundstransactions = function (parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var statusIdentifier = parameters['StatusIdentifier'];
        var domain = this.domain;
        var path = '/visadirect/fundstransfer/v1/multipushfundstransactions/' + statusIdentifier;

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['keyId'] = this.mleKeyId;
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';
        if(fs.existsSync(this.keyFile)) {
        } else {
            this.keyFile = pathLib.join(__dirname,  this.keyFile);

        }
        if(fs.existsSync(this.certificateFile)) {
        } else {
            this.certificateFile = pathLib.join(__dirname,  this.certificateFile);

        }
        if(fs.existsSync(this.mlePublicKeyPath)) {
        } else {
            this.mlePublicKeyPath = pathLib.join(__dirname,  this.mlePublicKeyPath);

        }
        if(fs.existsSync(privateKey)) {
        } else {
            privateKey= pathLib.join(__dirname,  privateKey);

        }
        encrypt(this.mlePublicKeyPath, this.mleKeyId, body).then(success => {
            var req = {
                method: 'GET',
                uri: domain + path,
                qs: queryParameters,
                key: fs.readFileSync(this.keyFile),
                cert: fs.readFileSync(this.certificateFile),
                headers: headers,
                body: success
            };
            if (this.proxy != "") {
                request = request.defaults({
                    'proxy': this.proxy
                });
            }
            if (Object.keys(form).length > 0) {
                req.form = form;
            }
            if (typeof(body) === 'object' && !(body instanceof Buffer)) {
                req.json = true;
            }


            request(req, function(error, response, body) {
                if (error) {
                    console.log("error " + JSON.stringify(error));
                    deferred.reject(error);
                } else {
                    if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {

                        }
                    }
                    var responseBody = JSON.stringify(body);
                    if (responseBody.indexOf('encData') != -1) {
                        decrypt(privateKey, body).then(success => {
                            response.body = success;
                            if (response.statusCode === 204) {
                                deferred.resolve({
                                    response: response
                                });
                            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                                deferred.resolve({
                                    response: response,
                                    body: success
                                });
                            } else {
                                deferred.reject({
                                    response: response,
                                    body: body
                                });
                            }

                        })
                            .catch(err => console.log("decryption error"));
                    } else {
                        deferred.reject({
                            response: response,
                            body: body
                        });

                    }

                }
            });

        })
            .catch(err => console.log("encryption error"));
        return deferred.promise;
    };
    /**
     * Read Multi Reverse Funds Transaction
     * @method
     * @name funds_transfer_api#multireversefundstransactions
     *
     */
    funds_transfer_api.prototype.multireversefundstransactions = function (parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();
        var statusIdentifier = parameters['StatusIdentifier'];
        var domain = this.domain;
        var path = '/visadirect/fundstransfer/v1/multireversefundstransactions/' + statusIdentifier;

        var body;
        var queryParameters = {};
        var headers = {};

        var form = {};
        if (parameters && parameters.payload) {
            body = parameters.payload;
        }

        headers['User-Agent'] = 'VDP_SampleCode_Nodejs';
        headers['keyId'] = this.mleKeyId;
        headers['Authorization'] = 'Basic ' + new Buffer(this.userId + ':' + this.password).toString('base64');
        headers['x-correlation-id'] = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '_SC';
        if(fs.existsSync(this.keyFile)) {
        } else {
            this.keyFile = pathLib.join(__dirname,  this.keyFile);

        }
        if(fs.existsSync(this.certificateFile)) {
        } else {
            this.certificateFile = pathLib.join(__dirname,  this.certificateFile);

        }
        if(fs.existsSync(this.mlePublicKeyPath)) {
        } else {
            this.mlePublicKeyPath = pathLib.join(__dirname,  this.mlePublicKeyPath);

        }
        if(fs.existsSync(privateKey)) {
        } else {
            privateKey= pathLib.join(__dirname,  privateKey);

        }
        encrypt(this.mlePublicKeyPath, this.mleKeyId, body).then(success => {
            var req = {
                method: 'GET',
                uri: domain + path,
                qs: queryParameters,
                key: fs.readFileSync(this.keyFile),
                cert: fs.readFileSync(this.certificateFile),
                headers: headers,
                body: success
            };
            if (this.proxy != "") {
                request = request.defaults({
                    'proxy': this.proxy
                });
            }
            if (Object.keys(form).length > 0) {
                req.form = form;
            }
            if (typeof(body) === 'object' && !(body instanceof Buffer)) {
                req.json = true;
            }


            request(req, function(error, response, body) {
                if (error) {
                    console.log("error " + JSON.stringify(error));
                    deferred.reject(error);
                } else {
                    if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {

                        }
                    }
                    var responseBody = JSON.stringify(body);
                    if (responseBody.indexOf('encData') != -1) {
                        decrypt(privateKey, body).then(success => {
                            response.body = success;
                            if (response.statusCode === 204) {
                                deferred.resolve({
                                    response: response
                                });
                            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                                deferred.resolve({
                                    response: response,
                                    body: success
                                });
                            } else {
                                deferred.reject({
                                    response: response,
                                    body: body
                                });
                            }

                        })
                            .catch(err => console.log("decryption error"));
                    } else {
                        deferred.reject({
                            response: response,
                            body: body
                        });

                    }

                }
            });

        })
            .catch(err => console.log("encryption error"));
        return deferred.promise;
    };
    const encrypt = (mleKey, mleKeyId, requestBody) => {
        return new Promise((resolve, reject) => {
            jose.JWK.asKey(fs.readFileSync(mleKey), 'PEM', {
                "kty": "RSA",
                "alg": "RSA-OAEP-256",
                "kid": mleKeyId,
                enc: "A128GCM",
                key_opts: ["wrapKey", "enc"]
            }).then(function(result) {
                //console.log(requestBody);
                jose.JWE.createEncrypt({
                    format: 'compact',
                    contentAlg: 'A128GCM',
                    fields: {
                        iat: Date.now()
                    }
                }, result).update(JSON.stringify(requestBody)).final()
                    .then(function(data) {
                        var encData = {
                            "encData": data.toString()
                        };
                        //console.log(encData);
                        resolve(encData);
                    }).catch(function(reason) {
                    reject(reason);
                    console.log(reason);
                });

            });

        });
    }


    const decrypt = (mleKeyPrivate, responseBody) => {
        return new Promise((resolve, reject) => {
            jose.JWK.asKey(fs.readFileSync(mleKeyPrivate), 'PEM').then(function(result) {

                jose.JWE.createDecrypt(result).decrypt(responseBody.encData, {
                    contentAlg: 'A128GCM',
                    alg: 'RSA-OAEP-256'
                }).then(function(decryptedResult) {
                    var decResult = String(decryptedResult.plaintext);
                    resolve(decResult);
                }).catch(function(reason) {
                    reject(reason);
                    console.log(reason);
                });

            });

        });
    }
    return funds_transfer_api;
})();

exports.funds_transfer_api = funds_transfer_api;
