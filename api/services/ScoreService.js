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
        })

        promise.then(callback);
    },

    getPlayersFromPage: function(page, callback) {
        var promise = new Promise(function(resolve, reject) {
            //TODO find players from osu site

            //TESTING
            var players = [];
            for (var i = (1 + (page - 1) * 50); i <= (50 + (page - 1) * 50); i++) {
                var player = {
                    name: "player" + 1,
                    rank: i
                };

                players.push(player);
            }
            //---
            
            resolve(players);
        })

        promise.then(callback);
    }

};
