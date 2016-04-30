module.exports = {
    attributes: {
        beatmapId: {
            type: 'integer',
            required: true
        },
        score: {
            type: 'integer',
            required: true
        },
        pp: {
            type: 'float',
            required: true
        },
        enabledMods: {
            type: 'integer',
            required: true
        },
        player: {
            model: 'player',
            required: true
        },
        beatmap: {
            model: 'beatmap'
        }
    },

    updateOrCreate: function (beatmapId, score, pp, enabledMods, player, callback) {
        HighScore.update(
            {beatmapId: beatmapId, player: player.id},
            {pp: pp, score: score, enabledMods: enabledMods}
        ).then(function(foundScore) {
            if(foundScore.length == 0) {
                BeatmapService.getBeatmap(beatmapId, function(beatmap) {
                    HighScore.create({
                        beatmapId: beatmapId,
                        score: score,
                        pp: pp,
                        enabledMods: enabledMods,
                        player: player,
                        beatmap: beatmap
                    }, function(err, createdScore) {
                        callback(createdScore);
                    });
                });
            } else {
                callback(foundScore[0]);
            }
        });
    }
}
