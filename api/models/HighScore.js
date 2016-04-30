module.exports = {
    attributes: {
        beatmapId: {
            type: 'integer'
        },
        score: {
            type: 'integer'
        },
        pp: {
            type: 'float'
        },
        player: {
            model: 'player'
        }
    },

    updateOrCreate: function (beatmapId, score, pp, player) {
        return HighScore.update(
            {beatmapId: beatmapId, player: player},
            {pp: pp, score: score}
        ).then(function(data) {
            if(data.length === 0){
                return HighScore.create({
                    beatmapId: beatmapId,
                    score: score,
                    pp: pp,
                    player: player
                });
            }
        });
      }
}
