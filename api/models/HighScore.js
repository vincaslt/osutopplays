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
        count50: {
            type: 'integer',
            required: true
        },
        count100: {
            type: 'integer',
            required: true
        },
        count300: {
            type: 'integer',
            required: true
        },
        countMiss: {
            type: 'integer',
            required: true
        },
        player: {
            model: 'player',
            required: true
        },
        beatmap: {
            model: 'beatmap'
        },
        getAccuracy: function() {
            return ((this.count300 * 300 + this.count100 * 100 + this.count50 * 50) /
                   ((this.count300 + this.count100 + this.count50 + this.countMiss) * 300) * 100).toFixed(2);
        },
        toJSON: function() {
            var highscore = this.toObject();
            highscore.accuracy = this.getAccuracy();
            return highscore;
        }
    },

    updateOrCreate: function (highscore, callback) {
        HighScore.update(
            {beatmapId: highscore.beatmapId, player: highscore.player.id}, highscore
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
