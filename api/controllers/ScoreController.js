module.exports = {
    highScores: function (req, res) {
        ScoreService.getHighScores(0, sails.config.application.scoresLimit, function(err, scores) {
            res.json(scores);
        });
    }
}
