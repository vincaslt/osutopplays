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
        countryRank: {
            type: 'integer',
            required: true
        },
        pp: {
            type: 'float',
            required: true
        },
        country: {
            type: 'string',
            required: true
        },
        scores: {
            collection: 'highscore',
            via: 'player'
        },
        getImage: function() {
            return "https://a.ppy.sh/" + this.id;
        },
        toJSON: function() {
            var player = this.toObject();
            player.image = this.getImage();
            return player;
        }
    },

    updateOrCreate: function(player, callback) {
        Player.update(
            {id: player.id}, player
        ).then(function(foundPlayer) {
            if(foundPlayer.length == 0) {
                Player.create(player, function(err, createdPlayer) {
                    callback(createdPlayer);
                });
            } else {
                callback(foundPlayer[0]);
            }
        });
    }
}
