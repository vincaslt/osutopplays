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

    /*
        returns player object:
        {
            id, name, rank
        }
    */
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
                        var playerLink = window.$(this).find('a');
                        var player = {
                            id: Number(playerLink.attr('href').slice(3)),
                            name: playerLink.html(),
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
    },

    /*
        identified - username or ID
    */
    getPlayerScores: function(identifier, callback) {
        var args = {
            parameters: {
                k: sails.config.apiKey,
                u: identifier
            }
        }

        UtilService.restClient.methods.getUserBest(args, function (data, response) {
            callback(data);
        });
    },

    /*
        Saves [min, max] ranked top players to database
    */
    collectTopPlayers: function(min, max, cb, includeScores = true) {
        function onSuccess(i, total, player) {
            console.log(i + "/" + total + " " + player.name + " includeScores = " + includeScores);
            if (i >= total) {
                console.log("Received scores... Done.");
                cb();
            }
        }

        console.log("Collecting players...");
        ScoreService.getTopPlayers(min, max, function(players) {
        console.log("Received players from osu API... Saving players...");
            var i = 1;
            players.forEach(function(player) {
                //console.log(player);
                Player.create({
                    id: player.id,
                    name: player.name,
                    rank: player.rank
                }).exec(function(err, createdPlayer) {
                    if (includeScores) {
                        ScoreService.getPlayerScores(createdPlayer.name, function(scores) {
                            var j = 0;
                            scores.forEach(function(score) {
                                //TODO update existing scores and error handling
                                HighScore.create({
                                    beatmapId: score.beatmap_id,
                                    score: score.score,
                                    pp: score.pp,
                                    player: createdPlayer
                                }).exec(function(err, createdScore) {
                                    j++;
                                    if (j >= scores.length) {
                                        onSuccess(i, players.length, createdPlayer);
                                        i++;
                                    }
                                });
                            });
                        });
                    } else {
                        onSuccess(i, players.length, createdPlayer);
                        i++;
                    }
                });
            });
        });
    }
};
