module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        //name: 'Foo',

        // set true to disabled this hob
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        frequency: 'every 1 hour',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            //priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job
        run: function(job, done) {
            console.log("Collecting players...");

            ScoreService.getTopPlayers(1, 50, function(players) {
                console.log("Received players... Collecting scores...");
                var remaining = players.length;
                players.forEach(function(player) {
                    ScoreService.getPlayerScores(player.name, function(scores) {
                        player.scores = scores;
                        remaining--;
                        console.log(remaining + "/" + players.length + " " + player.name);
                        if (remaining <= 0) {
                            console.log("Received scores... Done.");
                            //scores are now in players array, TODO save this to database
                            done();
                        }
                    });
                });
            });


        },
    };
    return job;
}
