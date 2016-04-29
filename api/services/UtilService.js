var jsdom = require('jsdom');
var qs = require('query-string');
var request = require('request');
var throttledRequest = require('throttled-request')(request);

throttledRequest.configure({
    requests: sails.config.application.apiInterval,
    milliseconds: 1000
});

module.exports = {
    jsdom: jsdom,
    throttledRequest: throttledRequest,
    qs: qs
}
