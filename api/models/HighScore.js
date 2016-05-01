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
        maxCombo: {
            type: 'integer',
            required: true
        },
        rank: {
            type: 'string',
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

    updateOrCreate: function (highscore, callback) {
        HighScore.update(
            {beatmapId: highscore.beatmapId, player: highscore.player.id},
            {
                pp: highscore.pp,
                score: highscore.score,
                enabledMods: highscore.enabledMods,
                maxCombo: highscore.maxCombo,
                rank: highscore.rank
            }
        ).then(function(foundScore) {
            if(foundScore.length == 0) {
                BeatmapService.getBeatmap(highscore.beatmapId, function(beatmap) {
                    highscore.beatmap = beatmap;
                    HighScore.create(highscore, function(err, createdScore) {
                        callback(createdScore);
                    });
                });
            } else {
                callback(foundScore[0]);
            }
        });
    }
}
