var jsdom = require('jsdom');
var urlAssembler = require('url-assembler');
var nodeRestClient = require('node-rest-client').Client;

var restClient = new nodeRestClient();

restClient.registerMethod("getUserBest", "https://osu.ppy.sh/api/get_user_best", "GET");

module.exports = {
    jsdom: jsdom,
    urlAssembler: urlAssembler,
    restClient: restClient
}
