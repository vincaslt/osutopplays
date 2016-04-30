module.exports = {
    attributes: {
        beatmapId: {
            type: 'integer',
            unique: true,
            primaryKey: true
        },
        beatmapsetId: {
            type: 'integer',
            required: true
        },
        artist: {
            type: 'string',
            required: true
        },
        title: {
            type: 'string',
            required: true
        },
        creator: {
            type: 'string',
            required: true
        },
        version: {
            type: 'string',
            required: true
        },

        getImage: function() {
            return 'https://b.ppy.sh/thumb/' + this.beatmapsetId + 'l.jpg'
        },

        toJSON: function() {
            var beatmap = this.toObject();
            beatmap.image = this.getImage();
            return beatmap;
        }
    }
}
