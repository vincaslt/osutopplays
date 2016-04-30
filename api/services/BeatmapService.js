module.exports = {

    getBeatmap: function(id, callback) {
        Beatmap.find({beatmapId: id}, function(err, beatmaps) {
            if (!beatmaps || beatmaps.length == 0) {
                BeatmapService.getBeatmapInfo(id, function (beatmap) {
                    Beatmap.findOrCreate({beatmapId: id}, {
                        beatmapId: beatmap.beatmap_id,
                        beatmapsetId: beatmap.beatmapset_id,
                        artist: beatmap.artist,
                        title: beatmap.title,
                        creator: beatmap.creator,
                        version: beatmap.version
                    }, function(err, bm) {
                        callback(bm);
                    });
                });
            } else {
                callback(beatmaps[0]);
            }
        });
    },

    getBeatmapInfo: function(id, callback) {
        UtilService.throttledRequest({
            url: 'https://osu.ppy.sh/api/get_beatmaps',
            qs: {
                k: sails.config.apiKey,
                b: id
            },
            json: true
        }, function (err, response, beatmaps) {
            callback(beatmaps[0]);
        });
    }

}
