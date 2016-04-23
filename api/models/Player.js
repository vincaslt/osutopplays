module.exports = {
    attributes: {
        id: {
            type: 'integer',
            unique: true,
            primaryKey: true
        },
        name: {
            type: 'string',
            required: true,
            unique: true
        },
        rank: {
            type: 'integer',
            required: true
        },
        scores: {
            collection: 'highscore',
            via: 'player'
        }
    }
}
