var jsdom = require('jsdom');

module.exports = {

    getTopPlayers: function(from, to, callback) {
        var promise = new Promise(function(resolve, reject) {
            var topPlayers = [];
            var maxPage = 1 + Math.floor((to - 1) / 50);
            var minPage = 1 + Math.floor((from - 1) / 50);
            var pagesLeft = 1 + maxPage - minPage;
            for (var page = minPage; page <= maxPage; page++) {
                ScoreService.getPlayersFromPage(page, function(players) {
                    players.forEach(function(player) {
                        if (player.rank >= from && player.rank <= to) {
                            topPlayers.push(player);
                        }
                    });

                    if (--pagesLeft <= 0) {
                        var sortedPlayers = topPlayers.sort(function(a, b) {
                            return a.rank - b.rank;
                        });
                        resolve(sortedPlayers);
                    }
                })
            }
        });

        promise.then(callback);
    },

    getPlayersFromPage: function(page, callback) {
        var url = UtilService.urlAssembler('https://osu.ppy.sh/p/pp/')
                                .param({m: 0, s: 3, o: 1, page: page})
                                .toString();
        var promise = new Promise(function(resolve, reject) {
            var players = [];
            jsdom.env(url, ["http://code.jquery.com/jquery.js"],
                function (err, window) {
                    var rows = window.$('.beatmapListing .row1p, .beatmapListing .row2p');
                    rows.each(function() {
                        var player = {
                            name: window.$(this).find('a').html(),
                            rank: Number(window.$(this).find('b').html().replace('#', ''))
                        };
                        if (players.push(player) >= 50) {
                            resolve(players);
                        }
                    });
                }
            );
        });

        promise.then(callback);
    }

};
