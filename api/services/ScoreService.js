module.exports = {

    getTopPlayers: function(from, to, callback) {
        var promise = new Promise(function(resolve, reject) {
            var topPlayers = [];
            var maxPage = 1 + Math.floor((to - 1) / 50);
            var minPage = 1 + Math.floor((from - 1) / 50);
            var pagesLeft = 1 + maxPage - minPage;
            sails.log('Pages left ' + pagesLeft);
            for (var page = minPage; page <= maxPage; page++) {
                setTimeout((function(page) {
                    ScoreService.getPlayersFromPage(page, function(players) {
                        players.forEach(function(player) {
                            if (player.pp_rank >= from && player.pp_rank <= to) {
                                topPlayers.push(player);
                            }
                        });

                        if (--pagesLeft <= 0) {
                            sails.log('done!');
                            var sortedPlayers = topPlayers.sort(function(a, b) {
                                return a.pp_rank - b.pp_rank;
                            });
                            resolve(sortedPlayers);
                        } else {
                            sails.log('Pages left ' + pagesLeft);
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
                        //TODO rework to a batch query
                        var playerId = Number(window.$(this).find('a').attr('href').slice(3));
                        PlayerService.getPlayerInfo(playerId, function(player) {
                            if (players.push(player) >= 50) {
                                resolve(players);
                            }
                        });
                    });
                }
            );
        });

        promise.then(callback);
    },

    getHighScores: function(min, max, cb) {
        HighScore.find({skip: min, limit: max, sort: 'pp DESC'}).populate('player').populate('beatmap').exec(cb);
    },

    /*
        identified - username or ID
    */
    getPlayerScores: function(identifier, callback) {
        UtilService.throttledRequest({
            url: 'https://osu.ppy.sh/api/get_user_best',
            qs: {
                k: sails.config.apiKey,
                u: identifier,
                limit: 100
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
            sails.log(i + "/" + total + " " + player.name + " includeScores = " + includeScores);
            if (i >= total) {
                sails.log("Received scores... Done.");
                cb();
            }
        }

        sails.log("Collecting players...");
        ScoreService.getTopPlayers(min, max, function(players) {
            sails.log("Received " + players.length + " players from osu API... Saving players...");
            var i = 1;
            players.forEach(function(player) {
                Player.updateOrCreate({
                    id: player.user_id,
                    name: player.username,
                    rank: player.pp_rank,
                    countryRank: player.pp_country_rank,
                    pp: player.pp_raw,
                    country: player.country
                }, function(createdPlayer) {
                    if (includeScores) {
                        ScoreService.getPlayerScores(createdPlayer.id, function(scores) {
                            var j = 0;
                            scores.forEach(function(score) {
                                HighScore.updateOrCreate({
                                    beatmapId: score.beatmap_id,
                                    score: score.score,
                                    pp: score.pp,
                                    enabledMods: score.enabled_mods,
                                    maxCombo: score.maxcombo,
                                    rank: score.rank,
                                    count50: score.count50,
                                    count100: score.count100,
                                    count300: score.count300,
                                    countMiss: score.countmiss,
                                    player: createdPlayer
                                },
                                function(createdScore) {
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
