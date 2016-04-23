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
    }
}
