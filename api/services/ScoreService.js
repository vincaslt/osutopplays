module.exports = {

    getTopPlayers: function(from, to, callback) {
        var promise = new Promise(function(resolve, reject) {
            var topPlayers = [];
            var maxPage = 1 + Math.floor((to - 1) / 50);
            var minPage = 1 + Math.floor((from - 1) / 50);
            var pagesLeft = 1 + maxPage - minPage;
            console.log('Pages left ' + pagesLeft);
            for (var page = minPage; page <= maxPage; page++) {
                setTimeout((function(page) {
                    ScoreService.getPlayersFromPage(page, function(players) {
                        players.forEach(function(player) {
                            if (player.rank >= from && player.rank <= to) {
                                topPlayers.push(player);
                            }
                        });

                        if (--pagesLeft <= 0) {
                            console.log('done!');
                            var sortedPlayers = topPlayers.sort(function(a, b) {
                                return a.rank - b.rank;
                            });
                            resolve(sortedPlayers);
                        } else {
                            console.log('Pages left ' + pagesLeft);
                        }
                    });
                }).bind(this, page), page * sails.config.application.parseInterval);
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
        var promise = new Promise(function(resolve, reject) {
            var url = 'https://osu.ppy.sh/p/pp/?' + UtilService.qs.stringify({m: 0, s: 3, o: 1, page: page});
            var players = [];
            UtilService.jsdom.env(url, ["http://code.jquery.com/jquery.js"],
                function (err, window) {
                    var rows = window.$('.beatmapListing .row1p, .beatmapListing .row2p');
                    rows.each(function() {
                        var playerLink = window.$(this).find('a');
                        var player = {
                            id: Number(playerLink.attr('href').slice(3)),
                            name: playerLink.html(),
                            rank: Number(window.$(this).find('b').html().replace('#', ''))
                        };
                        var l = players.push(player);
                        if (l >= 50) {
                            resolve(players);
                        }
                    });
                }
            );
        });

        promise.then(callback);
    },

    getHighScores: function(min, max, cb) {
        HighScore.find({skip: min, limit: max, sort: 'pp DESC'}).populate('player').exec(cb);
    },

    /*
        identified - username or ID
    */
    getPlayerScores: function(identifier, callback) {
        UtilService.throttledRequest({
            url: 'https://osu.ppy.sh/api/get_user_best',
            qs: {
                k: sails.config.apiKey,
                u: identifier
            },
            json: true
        }, function (err, response, scores) {
            callback(scores);
        });
    },

    /*
        Saves [min, max] ranked top players to database

        TODO refactor this
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
            console.log("Received " + players.length + " players from osu API... Saving players...");
            var i = 1;
            players.forEach(function(player) {
                Player.findOrCreate({id: player.id}, {
                    id: player.id,
                    name: player.name,
                    rank: player.rank
                }).exec(function(err, createdPlayer) {
                    if (includeScores) {
                        ScoreService.getPlayerScores(createdPlayer.id, function(scores) {
                            var j = 0;
                            scores.forEach(function(score) {
                                HighScore.updateOrCreate(
                                    score.beatmap_id,
                                    score.score,
                                    score.pp,
                                    createdPlayer
                                ).then(function(err, createdScore) {
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
