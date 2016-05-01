module.exports = {
    getPlayerInfo: function(id, callback) {
        UtilService.throttledRequest({
            url: 'https://osu.ppy.sh/api/get_user',
            qs: {
                k: sails.config.apiKey,
                u: id
            },
            json: true
        }, function (err, response, players) {
            callback(players[0]);
        });
    }
}
